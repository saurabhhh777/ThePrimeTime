import express from "express";
import { getIdeStats, createIdeStats, updateIdeStats, deleteIdeStats } from "../controllers/idestats.controller.js";

const router = express.Router();

router.get("/", getIdeStats);
router.post("/", createIdeStats);
router.put("/", updateIdeStats);
router.delete("/", deleteIdeStats);

export default router;
