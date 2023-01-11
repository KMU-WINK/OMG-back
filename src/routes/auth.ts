import express from "express";
import authController from "../controllers/auth";
import { validateBodyMiddleware } from "../validator";
import { LoginValidator, RegisterValidator } from "../validator/auth";

const router = express.Router();

router.post(
  "/login",
  validateBodyMiddleware(LoginValidator),
  authController.login
);
router.post(
  "/register",
  validateBodyMiddleware(RegisterValidator),
  authController.register
);

router.post("/forgot/email", authController.forgotEmailRequest);

router.post("/forgot/password", authController.forgotPasswordRequest);
router.put("/forgot/password", authController.changePassword);

export default router;
