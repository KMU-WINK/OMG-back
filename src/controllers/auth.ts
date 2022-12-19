import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { User } from "../entity/User";
import { HttpException } from "../utils/exception";
import { QueryFailedError } from "typeorm";
import { genToken } from "../utils/auth";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new HttpException(400, { code: "WRONG_EMAIL_OR_PASSWORD" }));
    }
    let token = `Bearer ${genToken(user)}`;
    return res.status(200).json({ token });
  } catch (err) {
    return next(err);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { email, name, password, phone } = req.body;
    let user = new User();
    user.email = email;
    user.name = name;
    user.password = await bcrypt.hash(password, 10);
    user.phone = phone;
    await User.save(user);
    let token = `Bearer ${genToken(user)}`;
    return res.status(200).json({ token });
  } catch (err) {
    if (err instanceof QueryFailedError) {
      if (err.driverError?.code === "ER_DUP_ENTRY") {
        return next(
          new HttpException(400, { code: "EMAIL_ALREADY_REGISTERED" })
        );
      }
    }
    return next(err);
  }
};

export default {
  login,
  register,
};
