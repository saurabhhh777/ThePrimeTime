import express from "express";
import { getLanguageStats, createLanguageStats, updateLanguageStats, deleteLanguageStats } from "../controllers/lang.contoller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getLanguageStats);
router.post("/", verifyToken, createLanguageStats);
router.put("/", verifyToken, updateLanguageStats);
router.delete("/", verifyToken, deleteLanguageStats);

export default router;
