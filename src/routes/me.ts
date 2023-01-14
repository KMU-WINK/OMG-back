import express from "express";
import meController from "../controllers/me";

const router = express.Router();

router.get("/", meController.getInfo);

export default router;
