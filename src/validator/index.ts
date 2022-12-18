import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../utils/exception";

const validateMiddleware =
  (obj: any) => async (req: Request, res: Response, next: NextFunction) => {
    let tmp = new obj();
    for (let key in req.body) {
      tmp[key] = req.body[key];
    }
    let errors = await validate(tmp);
    if (errors.length > 0) {
      return next(new ValidationError(errors));
    }
    return next();
  };

export default validateMiddleware;
