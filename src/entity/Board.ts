import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { BoardLike } from "./BoardLike";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @ManyToOne((type) => User, {
    nullable: false,
    eager: true,
  })
  user!: User;

  @Column("varchar", { length: 100, nullable: false })
  title!: string;

  @Column("mediumtext", { nullable: false })
  content!: string;

  @OneToMany((type) => BoardLike, (boardLike) => boardLike.board, {
    nullable: false,
    eager: true,
  })
  likes!: BoardLike[];

  @OneToMany((type) => Comment, (comment) => comment.board, {
    nullable: false,
    eager: true,
  })
  comments!: Comment[];
}
