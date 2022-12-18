export class HttpException extends Error {
  public status: number;
  public message: string;
  public json?: { [key: string]: string };
  constructor(
    status: number = 500,
    message: string = "알 수 없는 서버 오류가 발생했습니다.",
    json?: { [key: string]: string }
  ) {
    super(message);
    this.name = "HttpException";
    this.status = status;
    this.message = message;
    this.json = json;
  }
}
