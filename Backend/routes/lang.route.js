import express from "express";
import { getLanguageStats, createLanguageStats, updateLanguageStats, deleteLanguageStats } from "../controllers/lang.contoller.js";
import { isAuth } from "../middlewares/isAuth.middle.js";

const router = express.Router();

router.get("/", isAuth, getLanguageStats);
router.post("/", isAuth, createLanguageStats);
router.put("/", isAuth, updateLanguageStats);
router.delete("/", isAuth, deleteLanguageStats);

export default router;
