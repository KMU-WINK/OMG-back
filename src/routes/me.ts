import express from "express";
import meController from "../controllers/me";
import { validateBodyMiddleware } from "../validator";
import { UpdatePointLimitValidator } from "../validator/me";

const router = express.Router();

router.get("/", meController.getInfo);
router.put(
  "/point-limit",
  validateBodyMiddleware(UpdatePointLimitValidator),
  meController.updatePointLimit
);
router.put("/password", meController.changePassword);

export default router;
