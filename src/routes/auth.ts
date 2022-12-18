import express from "express";
import authController from "../controllers/auth";
import validate from "../validator";
import { LoginValidator, RegisterValidator } from "../validator/auth";

const router = express.Router();

router.post("/login", validate(LoginValidator), authController.login);
router.post("/register", validate(RegisterValidator), authController.register);

export default router;
