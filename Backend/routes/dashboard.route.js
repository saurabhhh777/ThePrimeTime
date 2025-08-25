import express from "express";
import { getDashboard, createDashboard, updateDashboard, deleteDashboard } from "../controllers/dashboard.controller.js";
import { isAuth } from "../middlewares/isAuth.middle.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(isAuth);

router.get("/", getDashboard);
router.post("/", createDashboard);
router.put("/", updateDashboard);
router.delete("/", deleteDashboard);

export default router;
