import { Request, Response, NextFunction } from "express";
import { QueryFailedError } from "typeorm";
import { HttpException } from "../utils/exception";
import { getUser } from "../utils/auth";
import { Board } from "../entity/Board";
import { BoardLike } from "../entity/BoardLike";
import { Comment } from "../entity/Comment";

const getList = async (req: Request, res: Response, next: NextFunction) => {
  let lists = await Board.find({
    order: {
      id: "DESC",
    },
  });
  return res.status(200).json(lists);
};

const read = async (req: Request, res: Response, next: NextFunction) => {
  let board = await Board.findOne({
    where: {
      id: Number.parseInt(req.params.id),
    },
  });
  if (!board) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }
  return res.status(200).json(board);
};

const write = async (req: Request, res: Response, next: NextFunction) => {
  let { title, content } = req.body;
  let board = new Board();
  board.user = await getUser(req);
  board.title = title;
  board.content = content;
  await Board.insert(board);
  return res.status(201).send("");
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  let board = await Board.findOne({
    where: {
      id: Number.parseInt(req.params.id),
      user: { id: (await getUser(req)).id },
    },
  });
  if (!board) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }
  await Board.delete(board.id);
  return res.status(204).send("");
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  let id = Number.parseInt(req.params.id);
  let { title, content } = req.body;
  let board = await Board.findOne({
    where: {
      id,
      user: { id: (await getUser(req)).id },
    },
  });
  if (!board) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }
  await Board.update(id, { title, content });
  return res.status(204).send("");
};

const addLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let id = Number.parseInt(req.params.id);

    let board = new Board();
    board.id = id;

    let boardLike = new BoardLike();
    boardLike.user = await getUser(req);
    boardLike.board = board;
    await BoardLike.insert(boardLike);

    return res.status(201).send("");
  } catch (err) {
    if (err instanceof QueryFailedError) {
      if (err.driverError?.code === "ER_DUP_ENTRY") {
        return next(new HttpException(400, { code: "BOARD_ALREADY_LIKED" }));
      }
    }
    return next(err);
  }
};

const removeLike = async (req: Request, res: Response, next: NextFunction) => {
  let id = Number.parseInt(req.params.id);

  let result = await BoardLike.delete({
    board: { id },
    user: { id: (await getUser(req)).id },
  });
  if (!result.affected) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }
  return res.status(204).send("");
};

const addComment = async (req: Request, res: Response, next: NextFunction) => {
  let id = Number.parseInt(req.params.id);
  let { content } = req.body;

  let board = new Board();
  board.id = id;

  let comment = new Comment();
  comment.board = board;
  comment.user = await getUser(req);
  comment.content = content;

  await Comment.insert(comment);
  return res.status(204).send("");
};

const removeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id = Number.parseInt(req.params.id);

  let result = await Comment.delete(id);
  if (!result.affected) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }
  return res.status(201).send("");
};

export default {
  getList,
  read,
  write,
  remove,
  update,
  addLike,
  removeLike,
  addComment,
  removeComment,
};
