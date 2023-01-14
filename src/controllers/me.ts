import { Request, Response, NextFunction } from "express";
import { Bottle } from "../entity/Bottle";
import { User } from "../entity/User";
import { UserInfo } from "../entity/UserInfo";
import { getUser } from "../utils/auth";

const getInfo = async (req: Request, res: Response, next: NextFunction) => {
  let user = await UserInfo.findOne({
    where: {
      user: { id: (await getUser(req)).id },
    },
  });
  let myBottle = await Bottle.find({
    where: {
      user: { id: (await getUser(req)).id },
    },
  });
  let reservedBottle = await Bottle.find({
    where: {
      reserved: { id: (await getUser(req)).id },
      complete: false,
    },
  });
  let completeBottle = await Bottle.find({
    where: {
      reserved: { id: (await getUser(req)).id },
      complete: true,
    },
  });

  return res.json({ user, myBottle, reservedBottle, completeBottle });
};

const updatePointLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { pointLimit } = req.body;
  await User.update((await getUser(req)).id, {
    pointLimit: pointLimit,
  });
  return res.status(204).send("");
};

export default {
  getInfo,
  updatePointLimit,
};
