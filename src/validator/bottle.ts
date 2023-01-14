import {
  IsNumberString,
  Length,
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateBottleValidator {
  @Length(1, 100)
  title!: string;

  @Length(1)
  img!: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  sojuNum!: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  beerNum!: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  extraNum!: number;

  @Length(1, 1000)
  address!: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  lat!: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  lng!: number;

  @IsOptional()
  @IsString()
  entrancePassword?: string;
}

export class ReserveBottleValidator {
  @IsDateString()
  date!: string;
}

export class IdParamValidator {
  @Length(1, 10)
  @IsNumberString({ no_symbols: true })
  id!: string;
}
