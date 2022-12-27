import { IsNumberString, Length } from "class-validator";

export class WriteValidator {
  @Length(1, 100)
  title!: string;

  @Length(1)
  content!: string;
}

export class UpdateValidator {
  @Length(1, 100)
  title!: string;

  @Length(1)
  content!: string;
}

export class IdParamValidator {
  @Length(1, 10)
  @IsNumberString({ no_symbols: true })
  id!: string;
}
