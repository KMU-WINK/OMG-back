import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import { AppDataSource } from "./data-source";
import { HttpException, ValidationError } from "./utils/exception";

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(cors());
  app.use(
    express.json({
      limit: "100mb",
    })
  );
  app.use("/api", router);
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpException) {
      res.status(err.status);
      if (err.json) {
        return res.json(err.json);
      }
      return res.send(err.message);
    }
    if (err instanceof ValidationError) {
      return res
        .status(400)
        .send({ code: "VALIDATION_ERROR", errors: err.errors });
    }
    if (
      err instanceof SyntaxError &&
      (err as any).type === "entity.parse.failed" &&
      err.message.indexOf("JSON") !== -1
    ) {
      return res.status(400).send({
        code: "JSON_PARSE_FAILED",
        detail:
          "Failed to parse json. Please make sure your json syntax is correct",
      });
    }
    console.log(err);
    if (res.headersSent) {
      return res.end();
    }
    return res.status(500).send("");
  });

  app.listen(8080, () => console.log("listening!"));
});
