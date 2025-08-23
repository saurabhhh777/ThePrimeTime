import express from "express";
const router = express.Router();
import { getUserReports, getProjectReport } from "../controllers/reports.controller.js";
import { isAuth } from "../middlewares/isAuth.middle.js";

// All routes require authentication
router.use(isAuth);

// Get comprehensive user reports
router.get("/", getUserReports);

// Get detailed project report
router.get("/project/:projectId", getProjectReport);

export default router; 