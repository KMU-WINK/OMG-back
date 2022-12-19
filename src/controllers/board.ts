import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/exception";
import { getUser } from "../utils/auth";
import { Board } from "../entity/Board";

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

export default {
  getList,
  read,
  write,
  remove,
  update,
};
