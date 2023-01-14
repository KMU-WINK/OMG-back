import express from "express";
import pingRouter from "./ping";
import authRouter from "./auth";
import boardRouter from "./board";
import bottleRouter from "./bottle";

import { authMiddleware } from "../utils/auth";

const router = express.Router();

router.use("/auth", authRouter);

router.use(authMiddleware);

router.use("/ping", pingRouter);
router.use("/board", boardRouter);
router.use("/bottle", bottleRouter);

export default router;
