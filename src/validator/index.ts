import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../utils/exception";

const validateBodyMiddleware =
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

const validateParamMiddleware =
  (obj: any) => async (req: Request, res: Response, next: NextFunction) => {
    let tmp = new obj();
    for (let key in req.params) {
      tmp[key] = req.params[key];
    }
    let errors = await validate(tmp);
    if (errors.length > 0) {
      return next(new ValidationError(errors));
    }
    return next();
  };

export { validateBodyMiddleware, validateParamMiddleware };
