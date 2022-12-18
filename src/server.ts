import express, { NextFunction, Request, Response } from "express";
import router from "./routes";
import { AppDataSource } from "./data-source";
import { HttpException, ValidationError } from "./utils/exception";

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(
    express.json({
      limit: "5mb",
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
      return res.status(400).send(err.errors[0].toString());
    }
    console.log(err);
    if (res.headersSent) {
      return res.end();
    }
    return res.status(500).send("");
  });

  app.listen(8080, () => console.log("listening!"));
});
