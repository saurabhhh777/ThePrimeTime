import express from "express";
const router = express.Router();
import {createNotification, getNotifications, markAsRead} from "../controllers/notifications.controller.js";
import { isAuth } from '../middlewares/isAuth.middle.js';

// Notification routes
router.post('/create', isAuth, createNotification);
router.get('/', isAuth, getNotifications);
router.put('/:id/read', isAuth, markAsRead);

export default router;
