import { IsNumber } from "class-validator";

export class UpdatePointLimitValidator {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  pointLimit!: number;
}
