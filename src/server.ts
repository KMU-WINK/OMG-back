import express from "express";
import router from "./routes";

const app = express();

app.use(
  express.json({
    limit: "5mb",
  })
);
app.use("/api", router);

app.listen(8080, () => console.log("listening!"));
