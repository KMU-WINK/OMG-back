import express from "express";
import router from "./routes";
import conn from "./database";

const app = express();

app.use(
  express.json({
    limit: "5mb",
  })
);
app.use("/api", router);

app.listen(8080, () => console.log("listening!"));
