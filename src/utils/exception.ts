import { ValidationError as OriValidationError } from "class-validator";

export class HttpException extends Error {
  public status: number;
  public message: string;
  public json?: { [key: string]: string };
  constructor(
    status: number = 500,
    message:
      | string
      | { [key: string]: string } = "알 수 없는 서버 오류가 발생했습니다."
  ) {
    super(typeof message === "string" ? message : "");
    this.name = "HttpException";
    this.status = status;
    this.message = typeof message === "string" ? message : "";
    if (typeof message !== "string") {
      this.json = message;
    }
  }
}

export class ValidationError extends Error {
  public errors: OriValidationError[];
  constructor(errors: OriValidationError[]) {
    super("");
    this.errors = errors;
  }
}
