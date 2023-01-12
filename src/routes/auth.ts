import express from "express";
import authController from "../controllers/auth";
import { validateBodyMiddleware } from "../validator";
import {
  ChangePasswordValidator,
  ForgotEmailRequestValidator,
  ForgotPasswordRequestValidator,
  LoginValidator,
  RegisterValidator,
} from "../validator/auth";

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

router.post(
  "/forgot/email",
  validateBodyMiddleware(ForgotEmailRequestValidator),
  authController.forgotEmailRequest
);

router.post(
  "/forgot/password",
  validateBodyMiddleware(ForgotPasswordRequestValidator),
  authController.forgotPasswordRequest
);
router.put(
  "/forgot/password",
  validateBodyMiddleware(ChangePasswordValidator),
  authController.changePassword
);

export default router;
