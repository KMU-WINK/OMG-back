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

export default router;
