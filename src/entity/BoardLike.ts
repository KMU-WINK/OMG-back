import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
} from "typeorm";
import { User } from "./User";
import { Board } from "./Board";

@Entity()
@Index(["user", "board"], { unique: true })
export class BoardLike extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @ManyToOne((type) => User, { nullable: false })
  user!: User;

  @ManyToOne((type) => Board, (board) => board.likes, { nullable: false })
  board!: Board;
}
