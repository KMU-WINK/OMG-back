import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./utils/config";
import { User } from "./entity/User";
import { Board } from "./entity/Board";
import { BoardLike } from "./entity/BoardLike";
import { Comment } from "./entity/Comment";

export const AppDataSource = new DataSource({
  type: "mysql",
  synchronize: true,
  logging: true,
  entities: [User, Board, BoardLike, Comment],
  migrations: [],
  subscribers: [],
  ...config.DB,
});
