import express from "express";
import { getGitStats, createGitStats, updateGitStats, deleteGitStats } from "../controllers/gitstats.controller.js";

const router = express.Router();

router.get("/", getGitStats);
router.post("/", createGitStats); 
router.put("/", updateGitStats);
router.delete("/", deleteGitStats);

export default router;
