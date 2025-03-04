import express from "express";
import { getDashboard, createDashboard, updateDashboard, deleteDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", getDashboard);
router.post("/", createDashboard);
router.put("/", updateDashboard);
router.delete("/", deleteDashboard);

export default router;
