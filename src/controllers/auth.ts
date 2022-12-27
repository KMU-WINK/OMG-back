import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { User } from "../entity/User";
import { UserInfo } from "../entity/UserInfo";
import { HttpException } from "../utils/exception";
import { QueryFailedError } from "typeorm";
import { genToken } from "../utils/auth";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { email, password } = req.body;
    let user = await UserInfo.findOne({
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
    user.name = name;
    user = await User.save(user);

    let userInfo = new UserInfo();
    userInfo.user = user;
    userInfo.email = email;
    userInfo.password = await bcrypt.hash(password, 10);
    userInfo.phone = phone;
    await UserInfo.save(userInfo);

    let token = `Bearer ${genToken(userInfo)}`;
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
