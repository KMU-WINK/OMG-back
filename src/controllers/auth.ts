import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { User } from "../entity/User";
import { UserInfo } from "../entity/UserInfo";
import { HttpException } from "../utils/exception";
import { QueryFailedError } from "typeorm";
import { genToken } from "../utils/auth";
import { sendSms } from "../utils/sms";
import { sha256 } from "../utils/hash";
import config from "../utils/config";

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

const forgotEmailRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { name, phone } = req.body;

  let userInfo = await UserInfo.findOne({
    where: {
      phone,
      user: {
        name,
      },
    },
  });
  if (!userInfo) {
    return next(new HttpException(400, { code: "NOT_FOUND" }));
  }
  await sendSms(phone, `[OMG] 이메일은 ${userInfo.email} 입니다.`);
  return res.status(204).send("");
};

const forgotPasswordRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { name, phone, email } = req.body;
  let userInfo = await UserInfo.findOne({
    where: {
      phone,
      email,
      user: {
        name,
      },
    },
  });
  if (!userInfo) {
    return next(new HttpException(400, { code: "NOT_FOUND" }));
  }
  let code = "123456";
  await sendSms(phone, `[OMG] 비밀번호 변경 인증코드는 ${code} 입니다.`);

  let now = +new Date();
  return res.json({
    token: JSON.stringify({
      i: userInfo.id,
      t: now,
      s: sha256(
        JSON.stringify({
          key: config.AUTH.hashKey,
          password: userInfo.password,
          code,
          time: now,
        })
      ),
    }),
  });
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { token, code, password } = req.body;
  let id: number, old_password: string, time: number;
  try {
    let tmp = JSON.parse(token);
    id = Number.parseInt(tmp.i);
    time = Number.parseInt(tmp.t);
    token = tmp.s;
    if (Number.isNaN(id) || Number.isNaN(time) || typeof token !== "string") {
      throw new Error("Wrong Type");
    }

    if (+new Date() - time > 3 * 60 * 1000) {
      return next(new HttpException(400, { code: "TIME_EXCEEDED" }));
    }

    let userInfo = await UserInfo.findOne({
      where: {
        id,
      },
    });
    if (!userInfo || !userInfo.password) {
      throw new Error("User Not Found");
    }
    old_password = userInfo.password;
  } catch {
    return next(new HttpException(400, { code: "WRONG_TOKEN" }));
  }

  if (
    token !==
    sha256(
      JSON.stringify({
        key: config.AUTH.hashKey,
        password: old_password,
        code,
        time,
      })
    )
  ) {
    return next(new HttpException(400, { code: "WRONG_CODE" }));
  }

  await UserInfo.update(id, {
    password: await bcrypt.hash(password, 10),
  });
  return res.status(204).send("");
};

export default {
  login,
  register,
  forgotEmailRequest,
  forgotPasswordRequest,
  changePassword,
};
