import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Board } from "./Board";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @ManyToOne((type) => User, {
    nullable: false,
    eager: true,
  })
  user!: User;

  @ManyToOne((type) => Board, (board) => board.comments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  board!: Board;

  @Column("mediumtext", { nullable: false })
  content!: string;
}
