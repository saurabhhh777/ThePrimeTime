import express from 'express';
import { submitCodingStats, getCodingStats, getLanguageStats, getDailyActivity } from '../controllers/codingstats.controller.js';
import { isAuth } from '../middlewares/isAuth.middle.js';

const router = express.Router();

// Submit coding statistics (no auth required for extension)
router.post('/submit', submitCodingStats);

// Get user's coding statistics (requires auth)
router.get('/stats', isAuth, getCodingStats);

// Get language-specific statistics
router.get('/language-stats', isAuth, getLanguageStats);

// Get daily activity
router.get('/daily-activity', isAuth, getDailyActivity);

export default router; 