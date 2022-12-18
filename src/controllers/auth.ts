import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import pool from "../database";

const login = async (req: Request, res: Response, next: NextFunction) => {
  let { email, password } = req.body;
  let [result]: any = await pool.query("SELECT id FROM `user` WHERE email=?", [
    email,
  ]);

  console.log(result);
  res.send("");
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  let { email, username, password, phone } = req.body;
  let result = await pool.query(
    "INSERT INTO `user` (`email`, `username`, `password`, `phone`) VALUES (?, ?, ?, ?)",
    [email, username, await bcrypt.hash(password, 10), phone]
  );
  console.log(result);
};

export default {
  login,
  register,
};
