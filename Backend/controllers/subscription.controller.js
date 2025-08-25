import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get subscription plans
export const getSubscriptionPlans = async (req, res) => {
    try {
        const plans = [
            {
                id: 'free',
                name: 'Free',
                price: 0,
                features: [
                    'Last 30 days data',
                    'Basic analytics',
                    'Language tracking',
                    'File tracking'
                ],
                limitations: [
                    'Limited to 30 days history',
                    'No custom date ranges',
                    'No advanced analytics'
                ]
            },
            {
                id: 'basic',
                name: 'Basic',
                price: 9.99,
                features: [
                    'Last 3 months data',
                    'Custom date ranges',
                    'Advanced analytics',
                    'Export data',
                    'Priority support'
                ],
                limitations: [
                    'No yearly data access',
                    'Limited export formats'
                ]
            },
            {
                id: 'pro',
                name: 'Pro',
                price: 19.99,
                features: [
                    'Full year data access',
                    'All Basic features',
                    'Team analytics',
                    'API access',
                    'Custom integrations',
                    'Advanced reporting'
                ],
                limitations: [
                    'No enterprise features'
                ]
            },
            {
                id: 'enterprise',
                name: 'Enterprise',
                price: 49.99,
                features: [
                    'Unlimited data access',
                    'All Pro features',
                    'Custom branding',
                    'Dedicated support',
                    'SLA guarantee',
                    'On-premise deployment'
                ],
                limitations: []
            }
        ];

        res.json({
            success: true,
            data: plans
        });
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user's current subscription
export const getUserSubscription = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                subscriptionType: true,
                subscriptionStart: true,
                subscriptionEnd: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isActive = user.subscriptionEnd ? new Date() < user.subscriptionEnd : true;

        res.json({
            success: true,
            data: {
                subscriptionType: user.subscriptionType,
                subscriptionStart: user.subscriptionStart,
                subscriptionEnd: user.subscriptionEnd,
                isActive,
                daysRemaining: user.subscriptionEnd ? 
                    Math.ceil((user.subscriptionEnd - new Date()) / (1000 * 60 * 60 * 24)) : null
            }
        });
    } catch (error) {
        console.error('Error fetching user subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update user subscription (simplified - in real app, integrate with payment processor)
export const updateSubscription = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string
        const { subscriptionType, paymentMethod } = req.body;

        // Validate subscription type
        const validTypes = ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'];
        if (!validTypes.includes(subscriptionType)) {
            return res.status(400).json({ error: 'Invalid subscription type' });
        }

        // In a real application, you would:
        // 1. Process payment with Stripe/PayPal/etc.
        // 2. Verify payment success
        // 3. Update subscription

        // For demo purposes, we'll just update the subscription
        const subscriptionStart = new Date();
        let subscriptionEnd = null;

        if (subscriptionType !== 'FREE') {
            // Set subscription end date (e.g., 1 month from now)
            subscriptionEnd = new Date();
            subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionType,
                subscriptionStart,
                subscriptionEnd
            },
            select: {
                subscriptionType: true,
                subscriptionStart: true,
                subscriptionEnd: true
            }
        });

        res.json({
            success: true,
            message: 'Subscription updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionType: 'FREE',
                subscriptionEnd: new Date() // End immediately
            },
            select: {
                subscriptionType: true,
                subscriptionEnd: true
            }
        });

        res.json({
            success: true,
            message: 'Subscription cancelled successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get subscription usage statistics
export const getSubscriptionUsage = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { subscriptionType: true }
        });

        // Get coding stats count for the user
        const statsCount = await prisma.codingStats.count({
            where: { userId }
        });

        // Get total duration
        const totalDuration = await prisma.codingStats.aggregate({
            where: { userId },
            _sum: { duration: true }
        });

        const usage = {
            subscriptionType: user.subscriptionType,
            totalSessions: statsCount,
            totalDuration: totalDuration._sum.duration || 0,
            dataRetentionDays: user.subscriptionType === 'FREE' ? 30 : 
                              user.subscriptionType === 'BASIC' ? 90 :
                              user.subscriptionType === 'PRO' ? 365 : 'Unlimited'
        };

        res.json({
            success: true,
            data: usage
        });
    } catch (error) {
        console.error('Error fetching subscription usage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 