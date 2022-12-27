import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./utils/config";
import { User } from "./entity/User";
import { Board } from "./entity/Board";
import { BoardLike } from "./entity/BoardLike";
import { Comment } from "./entity/Comment";
import { UserInfo } from "./entity/UserInfo";

export const AppDataSource = new DataSource({
  type: "mysql",
  synchronize: true,
  logging: true,
  entities: [User, UserInfo, Board, BoardLike, Comment],
  migrations: [],
  subscribers: [],
  ...config.DB,
});
