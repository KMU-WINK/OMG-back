import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
} from "typeorm";
import { User } from "./User";
import { Bottle } from "./Bottle";

@Entity()
@Index(["user", "bottle"], { unique: true })
export class BottleLike extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @ManyToOne((type) => User, {
    nullable: false,
    eager: true,
  })
  user!: User;

  @ManyToOne((type) => Bottle, (bottle) => bottle.likes, {
    nullable: false,
    onDelete: "CASCADE",
  })
  bottle!: Bottle;
}
