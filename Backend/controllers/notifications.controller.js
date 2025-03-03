import notificationModel from "../models/notifications.model.js";

// Get notifications for a user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await notificationModel.find({ user: userId });
        
        res.status(200).json({
            success: true,
            data: notifications
        });

    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
};

// Create new notification
export const createNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, message, type } = req.body;

        const notification = await notificationModel.create({
            user: userId,
            title,
            message,
            type
        });

        res.status(201).json({
            success: true,
            data: notification
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        const notification = await notificationModel.findOneAndUpdate(
            { _id: notificationId, user: userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            data: notification
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        const notification = await notificationModel.findOneAndDelete({ 
            _id: notificationId,
            user: userId 
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
