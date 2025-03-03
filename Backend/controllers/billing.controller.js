import billingModel from "../models/billing.model.js";

// Get billing details for a user
export const getBillingDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const billingDetails = await billingModel.findOne({ user: userId });
        
        if (!billingDetails) {
            return res.status(404).json({
                success: false,
                message: "Billing details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: billingDetails
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create new billing record
export const createBillingRecord = async (req, res) => {
    try {
        const userId = req.user._id;
        const { plan, billing_cycle, payment_method, transaction_id, wallet_address } = req.body;

        const billingExists = await billingModel.findOne({ user: userId });

        if (billingExists) {
            return res.status(400).json({
                success: false,
                message: "Billing record already exists for this user"
            });
        }

        const newBilling = await billingModel.create({
            user: userId,
            plan: plan || "free",
            billing_cycle: billing_cycle || "monthly",
            payment_method: payment_method || "card",
            transaction_id,
            wallet_address,
            next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            last_payment_date: new Date(),
            payment_status: "pending"
        });

        res.status(201).json({
            success: true,
            data: newBilling
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update billing details
export const updateBillingDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const { plan, billing_cycle, payment_method, transaction_id, wallet_address, payment_status } = req.body;

        const updatedBilling = await billingModel.findOneAndUpdate(
            { user: userId },
            { 
                plan,
                billing_cycle,
                payment_method,
                transaction_id,
                wallet_address,
                payment_status,
                next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                last_payment_date: new Date()
            },
            { new: true }
        );

        if (!updatedBilling) {
            return res.status(404).json({
                success: false,
                message: "Billing details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedBilling
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete billing record
export const deleteBillingRecord = async (req, res) => {
    try {
        const userId = req.user._id;
        const deletedBilling = await billingModel.findOneAndDelete({ user: userId });

        if (!deletedBilling) {
            return res.status(404).json({
                success: false,
                message: "Billing details not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Billing record deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
