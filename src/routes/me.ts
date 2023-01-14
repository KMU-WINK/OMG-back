import express from "express";
import meController from "../controllers/me";
import { validateBodyMiddleware } from "../validator";
import {
  ChangePasswordValidator,
  UpdateImageValidator,
  UpdatePointLimitValidator,
} from "../validator/me";

const router = express.Router();

router.get("/", meController.getInfo);
router.put(
  "/point-limit",
  validateBodyMiddleware(UpdatePointLimitValidator),
  meController.updatePointLimit
);
router.put(
  "/password",
  validateBodyMiddleware(ChangePasswordValidator),
  meController.changePassword
);
router.put(
  "/image",
  validateBodyMiddleware(UpdateImageValidator),
  meController.updateImage
);
router.delete("/image", meController.removeImage);

export default router;
