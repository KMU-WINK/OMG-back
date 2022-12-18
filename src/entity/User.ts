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

  @Column("varchar", { length: 320, nullable: false, unique: true })
  email!: string;

  @Column("varchar", { length: 10, nullable: false })
  name!: string;

  @Column("varchar", { length: 60, nullable: false })
  password!: string;

  @Column("varchar", { length: 20, nullable: false })
  phone!: string;
}
