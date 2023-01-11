import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../entity/User";
import { UserInfo } from "../entity/UserInfo";
import config from "./config";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "./exception";
import { sha256 } from "./hash";

interface Token {
  id: number;
  token: string;
}

const genToken = (userInfo: UserInfo) => {
  return jwt.sign(
    {
      id: userInfo.user.id,
      token: sha256(config.AUTH.hashKey + userInfo.password),
    },
    config.AUTH.secretKey,
    {
      expiresIn: "30d",
    }
  );
};

const verifyToken = async (
  token: string,
  verifyWithDatabase: boolean = false
) => {
  try {
    let decode = jwt.verify(token, config.AUTH.secretKey) as Token;
    if (verifyWithDatabase) {
      let userInfo = await UserInfo.findOne({
        where: {
          user: { id: decode.id },
        },
      });
      if (
        !userInfo ||
        decode.token !== sha256(config.AUTH.hashKey + userInfo.password)
      ) {
        return false;
      }
    }
    return decode.id;
  } catch {
    return false;
  }
};

const getUser = async (
  req: Request,
  requestDatabase: boolean = false
): Promise<User> => {
  let decode = jwt.verify(
    req.headers.authorization?.split(" ")[1] ?? "",
    config.AUTH.secretKey
  ) as Token;
  if (requestDatabase) {
    let user = await User.findOne({ where: { id: decode.id } });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  let user = new User();
  user.id = decode.id;
  return user;
};

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id = await verifyToken(req.headers.authorization?.split(" ")[1] ?? "");
  if (!id) {
    return next(new HttpException(401, { code: "UNAUTHORIZED" }));
  }
  return next();
};

export { genToken, verifyToken, authMiddleware, getUser };
