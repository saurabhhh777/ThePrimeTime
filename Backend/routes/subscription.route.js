import express from 'express';
import { 
    getSubscriptionPlans, 
    getUserSubscription, 
    updateSubscription, 
    cancelSubscription, 
    getSubscriptionUsage 
} from '../controllers/subscription.controller.js';
import { isAuth } from '../middlewares/isAuth.middle.js';

const router = express.Router();

// Get available subscription plans (public)
router.get('/plans', getSubscriptionPlans);

// User subscription management (requires auth)
router.get('/user', isAuth, getUserSubscription);
router.put('/user', isAuth, updateSubscription);
router.delete('/user', isAuth, cancelSubscription);
router.get('/usage', isAuth, getSubscriptionUsage);

export default router; 