import express from "express";
import cors from "cors";
import router from "./routes";
import { AppDataSource } from "./data-source";
import { addCustomAsyncErrorHandler, errorHandler } from "./utils/errorHandler";

AppDataSource.initialize().then(() => {
  addCustomAsyncErrorHandler();
  const app = express();

  app.use(cors());
  app.use(
    express.json({
      limit: "100mb",
    })
  );
  app.use("/api", router);
  app.use(errorHandler);

  app.listen(8080, () => console.log("listening!"));
});
