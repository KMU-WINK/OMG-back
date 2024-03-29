import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { Bottle } from "../entity/Bottle";
import { User } from "../entity/User";
import { UserInfo } from "../entity/UserInfo";
import { getUser } from "../utils/auth";
import { HttpException } from "../utils/exception";

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
  let likedBottle = await Bottle.find({
    where: {
      user: { id: (await getUser(req)).id },
      likes: {
        user: { id: (await getUser(req)).id },
      },
    },
  });

  return res.json({
    user,
    myBottle,
    reservedBottle,
    completeBottle,
    likedBottle,
  });
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

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { oldPassword, newPassword } = req.body;
  let userInfo = await UserInfo.findOne({
    where: {
      user: { id: (await getUser(req)).id },
    },
  });
  if (!userInfo) throw new Error("User not found");

  if (!(await bcrypt.compare(oldPassword, userInfo.password))) {
    return next(new HttpException(400, { code: "WRONG_PASSWORD" }));
  }

  await UserInfo.update(userInfo.id, {
    password: await bcrypt.hash(newPassword, 10),
  });
  return res.status(204).send("");
};

const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  let { img } = req.body;
  await User.update((await getUser(req)).id, {
    img,
  });
  return res.status(204).send("");
};

const removeImage = async (req: Request, res: Response, next: NextFunction) => {
  await User.createQueryBuilder()
    .update()
    .set({ img: () => "NULL" })
    .where("id = :id", { id: (await getUser(req)).id })
    .updateEntity(true)
    .execute();
  return res.status(204).send("");
};

export default {
  getInfo,
  updatePointLimit,
  changePassword,
  updateImage,
  removeImage,
};
