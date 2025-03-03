import express from 'express';
import { isAuth } from '../middlewares/isAuth.middle.js';
import {
    getBillingDetails,
    createBillingRecord
} from '../controllers/billing.controller.js';

const router = express.Router();

// Billing routes
router.get('/', isAuth, getBillingDetails);
router.post('/', isAuth, createBillingRecord);

export default router;
