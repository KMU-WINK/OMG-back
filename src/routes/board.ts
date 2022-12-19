import express from "express";
import boardController from "../controllers/board";
import validateMiddleware from "../validator";
import { UpdateValidator, WriteValidator } from "../validator/board";

const router = express.Router();

router.get("/", boardController.getList);
router.post("/", validateMiddleware(WriteValidator), boardController.write);

router.get("/:id", boardController.read);
router.delete("/:id", boardController.remove);
router.put("/:id", validateMiddleware(UpdateValidator), boardController.update);

export default router;
