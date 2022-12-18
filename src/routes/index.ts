import express from "express";
import pingRouter from "./ping";
import authRouter from "./auth";
import { authMiddleware } from "../utils/auth";

const router = express.Router();

router.use("/auth", authRouter);

router.use(authMiddleware);

router.use("/ping", pingRouter);

export default router;
