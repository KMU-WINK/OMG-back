import express from "express";
import boardController from "../controllers/board";
import { validateBodyMiddleware, validateParamMiddleware } from "../validator";
import {
  CommentValidator,
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

router.post(
  "/:id/like",
  validateParamMiddleware(IdParamValidator),
  boardController.addLike
);
router.delete(
  "/:id/like",
  validateParamMiddleware(IdParamValidator),
  boardController.removeLike
);

router.post(
  "/:id/comment",
  validateBodyMiddleware(CommentValidator),
  validateParamMiddleware(IdParamValidator),
  boardController.addComment
);
router.delete(
  "/:_/comment/:id",
  validateParamMiddleware(IdParamValidator),
  boardController.removeComment
);

export default router;
