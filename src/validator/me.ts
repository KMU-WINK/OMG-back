import { IsNumber, Length } from "class-validator";

export class UpdatePointLimitValidator {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  pointLimit!: number;
}

export class ChangePasswordValidator {
  @Length(8, 60)
  oldPassword!: string;

  @Length(8, 60)
  newPassword!: string;
}
