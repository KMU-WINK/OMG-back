import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../entity/User";
import config from "./config";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "./exception";

const sha256 = (content: string) =>
  crypto.createHash("sha256").update(content).digest("hex");

interface Token {
  id: number;
  token: string;
}

const genToken = (user: User) => {
  return jwt.sign(
    { id: user.id, token: sha256(config.AUTH.hashKey + user.password) },
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
      let user = await User.findOne({
        where: {
          id: decode.id,
        },
      });
      if (
        !user ||
        decode.token !== sha256(config.AUTH.hashKey + user.password)
      ) {
        return false;
      }
    }
    return decode.id;
  } catch {
    return false;
  }
};

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id = await verifyToken(req.headers.authorization?.split(" ")[1] ?? "");
  if (!id) {
    return next(new HttpException(401, "Unauthorized"));
  }
  return next();
};

export { genToken, verifyToken, authMiddleware };
