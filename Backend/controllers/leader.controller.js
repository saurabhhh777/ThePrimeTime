import leaderModel from "../models/leader.model.js";

// Get leader details for a user
export const getLeaderDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const leaderDetails = await leaderModel.findOne({ user: userId });
        
        if (!leaderDetails) {
            return res.status(404).json({
                success: false,
                message: "Leader details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: leaderDetails
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update leader details
export const updateLeaderDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const { rank, points, badges } = req.body;

        const updateData = {
            rank,
            points,
            badges
        };

        const updatedLeader = await leaderModel.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true }
        );

        if (!updatedLeader) {
            return res.status(404).json({
                success: false,
                message: "Leader details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedLeader
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete leader record
export const deleteLeaderRecord = async (req, res) => {
    try {
        const userId = req.user._id;
        const deletedLeader = await leaderModel.findOneAndDelete({ user: userId });

        if (!deletedLeader) {
            return res.status(404).json({
                success: false,
                message: "Leader details not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Leader record deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
