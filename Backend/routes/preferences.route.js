import express from "express";
const router = express.Router();
import { AddingPreferences } from "../controllers/preferences.controller.js";
import { isAuth } from "../middlewares/isAuth.middle.js";

// Preferences routes
router.post('/', isAuth, AddingPreferences);

export default router;