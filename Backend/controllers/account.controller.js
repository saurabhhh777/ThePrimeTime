import accountModel from "../models/account.model.js";

// Get account details for a user
export const getAccountDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const accountDetails = await accountModel.findOne({ user: userId });
        
        if (!accountDetails) {
            return res.status(404).json({
                success: false,
                message: "Account details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: accountDetails
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update account details
export const updateAccountDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const { primary_email, backup_email, github_user_id } = req.body;

        const updateData = {
            emails: {
                primary_email,
                backup_email,
                github_user_id
            }
        };

        const updatedAccount = await accountModel.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedAccount
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update API key
export const updateApiKey = async (req, res) => {
    try {
        const userId = req.user._id;
        const { secret_api_key } = req.body;

        const updatedAccount = await accountModel.findOneAndUpdate(
            { user: userId },
            { secret_api_key },
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedAccount
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Initiate account deletion
export const initiateAccountDeletion = async (req, res) => {
    try {
        const userId = req.user._id;
        const deletionDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

        const updatedAccount = await accountModel.findOneAndUpdate(
            { user: userId },
            {
                'danger_zone.delete_account': true,
                'danger_zone.delete_account_date': deletionDate
            },
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedAccount,
            message: `Account will be deleted on ${deletionDate.toISOString()}`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel account deletion
export const cancelAccountDeletion = async (req, res) => {
    try {
        const userId = req.user._id;

        const updatedAccount = await accountModel.findOneAndUpdate(
            { user: userId },
            {
                'danger_zone.delete_account': false,
                'danger_zone.delete_account_date': null
            },
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedAccount,
            message: "Account deletion has been cancelled"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
