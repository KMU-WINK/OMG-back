import { IsEmail, Length } from "class-validator";

export class RegisterValidator {
  @IsEmail()
  email!: string;

  @Length(2, 10)
  name!: string;

  @Length(8, 60)
  password!: string;

  @Length(10, 11)
  phone!: string;
}

export class LoginValidator {
  @IsEmail()
  email!: string;

  @Length(8, 60)
  password!: string;
}
