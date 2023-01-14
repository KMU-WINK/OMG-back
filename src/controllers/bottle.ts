import { Request, Response, NextFunction } from "express";
import { QueryFailedError } from "typeorm";
import { Bottle } from "../entity/Bottle";
import { BottleLike } from "../entity/BottleLike";
import { getUser } from "../utils/auth";
import { HttpException } from "../utils/exception";
import config from "../utils/config";

const getList = async (req: Request, res: Response, next: NextFunction) => {
  let list = await Bottle.find();
  return res.status(200).json(list);
};

const getBottle = async (req: Request, res: Response, next: NextFunction) => {
  let bottle = await Bottle.findOne({
    where: {
      id: Number.parseInt(req.params.id),
    },
  });
  if (!bottle) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }
  return res.status(200).json(bottle);
};

const createBottle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { title, img, sojuNum, beerNum, extraNum, address, lat, lng } = req.body;

  let bottle = new Bottle();
  bottle.user = await getUser(req);
  bottle.title = title;
  bottle.img = img;
  bottle.sojuNum = sojuNum;
  bottle.beerNum = beerNum;
  bottle.extraNum = extraNum;
  bottle.address = address;
  bottle.lat = lat;
  bottle.lng = lng;
  bottle.money =
    sojuNum * config.PRICE.SOJU +
    beerNum * config.PRICE.BEER +
    extraNum * config.PRICE.EXTRA;

  await Bottle.insert(bottle);
  return res.status(201).send("");
};

const removeBottle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id = Number.parseInt(req.params.id);

  let result = await Bottle.delete({
    id,
    user: { id: (await getUser(req)).id },
  });
  if (!result.affected) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }
  return res.status(204).send("");
};

const addLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let id = Number.parseInt(req.params.id);

    let bottle = new Bottle();
    bottle.id = id;

    let bottleLike = new BottleLike();
    bottleLike.user = await getUser(req);
    bottleLike.bottle = bottle;
    await BottleLike.insert(bottleLike);

    return res.status(201).send("");
  } catch (err) {
    if (err instanceof QueryFailedError) {
      if (err.driverError?.code === "ER_DUP_ENTRY") {
        return next(new HttpException(400, { code: "BOTTLE_ALREADY_LIKED" }));
      }
    }
    return next(err);
  }
};

const removeLike = async (req: Request, res: Response, next: NextFunction) => {
  let id = Number.parseInt(req.params.id);

  let result = await BottleLike.delete({
    bottle: { id },
    user: { id: (await getUser(req)).id },
  });
  if (!result.affected) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }
  return res.status(204).send("");
};

const addClick = async (req: Request, res: Response, next: NextFunction) => {
  let id = Number.parseInt(req.params.id);

  await Bottle.update(id, {
    clicks: () => "clicks + 1",
  });

  return res.status(201).send("");
};

export default {
  getList,
  getBottle,
  createBottle,
  removeBottle,
  addLike,
  removeLike,
  addClick,
};
