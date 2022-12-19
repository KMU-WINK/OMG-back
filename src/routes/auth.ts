import express from "express";
import authController from "../controllers/auth";
import validateMiddleware from "../validator";
import { LoginValidator, RegisterValidator } from "../validator/auth";

const router = express.Router();

router.post("/login", validateMiddleware(LoginValidator), authController.login);
router.post(
  "/register",
  validateMiddleware(RegisterValidator),
  authController.register
);

export default router;
