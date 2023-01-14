import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @Column("varchar", { length: 10, nullable: false })
  name!: string;

  @Column("int", { nullable: false, default: 1000 })
  point!: number;

  @Column("int", { nullable: false, default: 1000 })
  pointLimit!: number;
}
