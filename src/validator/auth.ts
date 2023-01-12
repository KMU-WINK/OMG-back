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

export class ForgotEmailRequestValidator {
  @Length(2, 10)
  name!: string;

  @Length(10, 11)
  phone!: string;
}

export class ForgotPasswordRequestValidator {
  @Length(2, 10)
  name!: string;

  @Length(10, 11)
  phone!: string;

  @IsEmail()
  email!: string;
}

export class ChangePasswordValidator {
  @Length(90, 120)
  token!: string;

  @Length(6)
  code!: string;

  @Length(8, 60)
  password!: string;
}
