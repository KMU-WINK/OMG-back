import { Request, Response, NextFunction } from "express";
import {
  QueryFailedError,
  IsNull,
  MoreThanOrEqual,
  LessThanOrEqual,
} from "typeorm";
import { Bottle } from "../entity/Bottle";
import { BottleLike } from "../entity/BottleLike";
import { getUser } from "../utils/auth";
import { HttpException } from "../utils/exception";
import config from "../utils/config";
import { User } from "../entity/User";

const getList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user = await User.findOne({
      where: { id: (await getUser(req)).id },
    });
    if (!user) {
      throw new Error("User not found");
    }

    let list = await Bottle.find({
      where: {
        reserved: IsNull(),
        user: {
          point: MoreThanOrEqual(user.pointLimit),
          pointLimit: LessThanOrEqual(user.point),
        },
      },
    });
    return res.status(200).json(list);
  } catch (err) {
    return next(err);
  }
};

const getBottle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user = await User.findOne({
      where: { id: (await getUser(req)).id },
    });
    if (!user) {
      throw new Error("User not found");
    }

    let bottle = await Bottle.findOne({
      where: {
        id: Number.parseInt(req.params.id),
        user: {
          point: MoreThanOrEqual(user.pointLimit),
          pointLimit: LessThanOrEqual(user.point),
        },
      },
    });
    if (!bottle) {
      return next(new HttpException(404, { code: "NOT_FOUND" }));
    }
    return res.status(200).json(bottle);
  } catch (err) {
    return next(err);
  }
};

const createBottle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let {
    title,
    img,
    sojuNum,
    beerNum,
    extraNum,
    address,
    lat,
    lng,
    entrancePassword,
  } = req.body;

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
  if (entrancePassword) {
    bottle.entrancePassword = entrancePassword;
  }

  await Bottle.insert(bottle);

  await User.update((await getUser(req)).id, {
    bottleSell: () => "bottleSell + 1",
  });

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

const reserveBottle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let date = new Date(req.body.date);
    let id = Number.parseInt(req.params.id);

    let user = await User.findOne({
      where: { id: (await getUser(req)).id },
    });
    if (!user) {
      throw new Error("User not found");
    }

    // validate point limit
    let bottle = await Bottle.findOne({
      where: {
        id: Number.parseInt(req.params.id),
        user: {
          point: MoreThanOrEqual(user.pointLimit),
          pointLimit: LessThanOrEqual(user.point),
        },
      },
    });
    if (!bottle) {
      return next(new HttpException(404, { code: "NOT_FOUND" }));
    }

    let result = await Bottle.createQueryBuilder()
      .update()
      .set({ reserved: await getUser(req), reservedDate: date })
      .where("id = :id AND reserved IS NULL", { id })
      .updateEntity(true)
      .execute();
    if (!result.affected) {
      return next(new HttpException(404, { code: "NOT_FOUND" }));
    }
    return res.status(201).send("");
  } catch (err) {
    return next(err);
  }
};

const reserveCancelBottle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id = Number.parseInt(req.params.id);
  let result = await Bottle.createQueryBuilder()
    .update()
    .set({ reserved: () => "NULL", reservedDate: () => "NULL" })
    .where("id = :id AND complete = :complete AND reserved = :reserved", {
      id,
      complete: false,
      reserved: (await getUser(req)).id,
    })
    .updateEntity(true)
    .execute();
  if (!result.affected) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }
  return res.status(204).send("");
};

const completeBottle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id = Number.parseInt(req.params.id);

  let bottle = await Bottle.findOne({
    where: { id },
  });
  if (!bottle) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }

  let result = await Bottle.createQueryBuilder()
    .update()
    .set({ complete: true })
    .where("id = :id AND complete = :complete AND reserved = :reserved", {
      id,
      complete: false,
      reserved: (await getUser(req)).id,
    })
    .updateEntity(true)
    .execute();
  if (!result.affected) {
    return next(new HttpException(404, { code: "NOT_FOUND" }));
  }

  let point =
    config.POINT.SOJU * bottle.sojuNum +
    config.POINT.BEER * bottle.beerNum +
    config.POINT.EXTRA * bottle.extraNum;

  await User.update(id, {
    point: () => `point + ${point}`,
    bottleBuy: () => "bottleBuy + 1",
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
  reserveBottle,
  reserveCancelBottle,
  completeBottle,
};
