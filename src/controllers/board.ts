import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { User } from "../entity/User";
import { HttpException } from "../utils/exception";
import { QueryFailedError } from "typeorm";
import { genToken, getUser } from "../utils/auth";
import { Board } from "../entity/Board";

const getList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let lists = await Board.find();
    return res.json(lists);
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
    return res.status(200).send("");
  } catch (err) {
    return next(err);
  }
};

export default {
  getList,
  write,
};
