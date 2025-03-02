import express from "express";
const router = express.Router();

import userRoutes from "./user.route.js";
import accountRoutes from "./account.route.js";
import preferencesRoutes from "./preferences.route.js";
import notificationsRoutes from "./notifications.route.js";
import billingRoutes from "./billing.route.js";
import leaderRoutes from "./leader.route.js"; // ✅ Import Leaderboard Routes

router.use("/user", userRoutes);
router.use("/account", accountRoutes);
router.use("/preferences", preferencesRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/billing", billingRoutes);
router.use("/leaderboard", leaderRoutes); // ✅ Use Leaderboard Routes

export default router;
