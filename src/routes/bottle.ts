import express from "express";
import bottleController from "../controllers/bottle";
import { validateBodyMiddleware, validateParamMiddleware } from "../validator";
import {
  CreateBottleValidator,
  IdParamValidator,
  ReserveBottleValidator,
} from "../validator/bottle";

const router = express.Router();

router.get("/", bottleController.getList);
router.post(
  "/",
  validateBodyMiddleware(CreateBottleValidator),
  bottleController.createBottle
);

router.get(
  "/:id",
  validateParamMiddleware(IdParamValidator),
  bottleController.getBottle
);
router.delete(
  "/:id",
  validateParamMiddleware(IdParamValidator),
  bottleController.removeBottle
);

router.post(
  "/:id/like",
  validateParamMiddleware(IdParamValidator),
  bottleController.addLike
);
router.delete(
  "/:id/like",
  validateParamMiddleware(IdParamValidator),
  bottleController.removeLike
);

router.post(
  "/:id/click",
  validateParamMiddleware(IdParamValidator),
  bottleController.addClick
);

router.post(
  "/:id/reserve",
  validateBodyMiddleware(ReserveBottleValidator),
  validateParamMiddleware(IdParamValidator),
  bottleController.reserveBottle
);
router.delete(
  "/:id/reserve",
  validateParamMiddleware(IdParamValidator),
  bottleController.reserveCancelBottle
);

router.post(
  "/:id/complete",
  validateParamMiddleware(IdParamValidator),
  bottleController.completeBottle
);

export default router;
