import express from "express";
import boardController from "../controllers/board";
import { validateBodyMiddleware, validateParamMiddleware } from "../validator";
import {
  IdParamValidator,
  UpdateValidator,
  WriteValidator,
} from "../validator/board";

const router = express.Router();

router.get("/", boardController.getList);
router.post("/", validateBodyMiddleware(WriteValidator), boardController.write);

router.get(
  "/:id",
  validateParamMiddleware(IdParamValidator),
  boardController.read
);
router.delete(
  "/:id",
  validateParamMiddleware(IdParamValidator),
  boardController.remove
);
router.put(
  "/:id",
  validateBodyMiddleware(UpdateValidator),
  validateParamMiddleware(IdParamValidator),
  boardController.update
);

export default router;
