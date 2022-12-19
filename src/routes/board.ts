import express from "express";
import boardController from "../controllers/board";
import validate from "../validator";

const router = express.Router();

router.get("/", boardController.getList);
router.post("/", boardController.write);

export default router;
