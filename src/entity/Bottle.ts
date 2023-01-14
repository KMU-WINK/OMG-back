import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { BottleLike } from "./BottleLike";

@Entity()
export class Bottle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @ManyToOne((type) => User, {
    nullable: false,
    eager: true,
  })
  user!: User;

  @ManyToOne((type) => User, {
    nullable: true,
    eager: true,
  })
  reserved!: User;

  @Column("datetime", { nullable: true })
  reservedDate!: Date;

  @Column("varchar", { length: 100, nullable: false })
  title!: string;

  @Column("int", { nullable: false })
  sojuNum!: number;

  @Column("int", { nullable: false })
  beerNum!: number;

  @Column("int", { nullable: false })
  extraNum!: number;

  @Column("int", { nullable: false })
  money!: number;

  @Column("text", { nullable: false })
  address!: string;

  @OneToMany((type) => BottleLike, (bottleLike) => bottleLike.bottle, {
    nullable: false,
    eager: true,
  })
  likes!: BottleLike[];

  @Column("bigint", { nullable: false, default: 0 })
  clicks!: number;

  @Column("double", { nullable: false }) // floating point errors may occur.
  lat!: number;

  @Column("double", { nullable: false }) // floating point errors may occur.
  lng!: number;
}
