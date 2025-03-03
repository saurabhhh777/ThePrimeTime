import express from "express";
import { isAuth } from '../middlewares/isAuth.middle.js';
import {
    getLeaderDetails,
    updateLeaderDetails,
    deleteLeaderRecord
} from '../controllers/leader.controller.js';

const router = express.Router();

// Leader routes
router.get('/', isAuth, getLeaderDetails);
router.put('/update', isAuth, updateLeaderDetails);
router.delete('/delete', isAuth, deleteLeaderRecord);

export default router;
