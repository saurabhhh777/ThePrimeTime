import express from "express";
import { isAuth } from '../middlewares/isAuth.middle.js';
import {
    getLeaderDetails,
    updateLeaderDetails,
    deleteLeaderRecord,
    getGlobalLeaderboard
} from '../controllers/leader.controller.js';

const router = express.Router();

// All routes require authentication
router.use(isAuth);

// Get global leaderboard
router.get("/global", getGlobalLeaderboard);

// Get leader details for a user
router.get("/details", getLeaderDetails);

// Update leader details
router.put("/update", updateLeaderDetails);

// Delete leader record
router.delete("/delete", deleteLeaderRecord);

export default router;
