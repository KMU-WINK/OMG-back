import express from "express";
import boardController from "../controllers/board";

const router = express.Router();

router.get("/", boardController.getList);
router.post("/", boardController.write);

router.get("/:id", boardController.read);
router.delete("/:id", boardController.remove);
router.put("/:id", boardController.update);

export default router;
