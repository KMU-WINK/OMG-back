import { Request, Response, NextFunction } from "express";
import { QueryFailedError } from "typeorm";
import { HttpException } from "../utils/exception";
import { getUser } from "../utils/auth";
import { Board } from "../entity/Board";
import { BoardLike } from "../entity/BoardLike";

const getList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let lists = await Board.find();
    return res.status(200).json(lists);
  } catch (err) {
    return next(err);
  }
};

const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let board = await Board.findOne({
      where: {
        id: Number.parseInt(req.params.id),
      },
    });
    if (!board) {
      return next(new HttpException(404, { code: "NOT_FOUND" }));
    }
    return res.status(200).json(board);
  } catch (err) {
    return next(err);
  }
};

const write = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { title, content } = req.body;
    let board = new Board();
    board.user = await getUser(req);
    board.title = title;
    board.content = content;
    await Board.insert(board);
    return res.status(201).send("");
  } catch (err) {
    return next(err);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (err) {
    return next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (err) {
    return next(err);
  }
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

export default {
  getList,
  read,
  write,
  remove,
  update,
  addLike,
  removeLike,
};
