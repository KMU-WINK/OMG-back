import express from "express";
import pingRouter from "./ping";
import authRouter from "./auth";

const router = express.Router();

router.use("/ping", pingRouter);
router.use("/auth", authRouter);

export default router;
