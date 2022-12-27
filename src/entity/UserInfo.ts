import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class UserInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @ManyToOne((type) => User, {
    nullable: false,
    eager: true,
  })
  user!: User;

  @Column("varchar", { length: 320, nullable: false, unique: true })
  email!: string;

  @Column("varchar", { length: 60, nullable: false })
  password!: string;

  @Column("varchar", { length: 20, nullable: false })
  phone!: string;
}
