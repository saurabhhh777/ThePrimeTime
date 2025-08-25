import leaderModel from "../models/leader.model.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get global leaderboard
export const getGlobalLeaderboard = async (req, res) => {
    try {
        const { period = 'all', country = 'all', limit = 50 } = req.query;

        // Get all users with their coding statistics
        const users = await prisma.user.findMany({
            include: {
                codingStats: {
                    orderBy: { timestamp: 'desc' }
                }
            }
        });

        // Calculate statistics for each user
        const userStats = users.map(user => {
            const totalDuration = user.codingStats.reduce((sum, stat) => sum + stat.duration, 0);
            const totalLinesChanged = user.codingStats.reduce((sum, stat) => sum + stat.linesChanged, 0);
            const totalCharactersTyped = user.codingStats.reduce((sum, stat) => sum + stat.charactersTyped, 0);
            const totalSessions = user.codingStats.length;
            
            // Calculate daily average (assuming 30 days)
            const dailyAvg = totalDuration > 0 ? (totalDuration / (1000 * 60 * 60)) / 30 : 0;
            
            // Get unique languages
            const languages = [...new Set(user.codingStats.map(stat => stat.language))];
            
            return {
                _id: user.id,
                user: {
                    _id: user.id,
                    username: user.name || 'Anonymous',
                    email: user.email,
                    profilePicture: user.profilePicture
                },
                user_rank: 0, // Will be calculated after sorting
                user_id: user.id,
                hours_coded: Math.round((totalDuration / (1000 * 60 * 60)) * 10) / 10,
                daily_avg: Math.round(dailyAvg * 10) / 10,
                language_used: languages,
                country: 'Unknown', // Default country
                totalLinesChanged,
                totalCharactersTyped,
                totalSessions,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        });

        // Filter by country if specified
        let filteredStats = userStats;
        if (country !== 'all') {
            filteredStats = userStats.filter(user => user.country === country);
        }

        // Sort by hours coded and assign ranks
        filteredStats.sort((a, b) => b.hours_coded - a.hours_coded);
        filteredStats.forEach((user, index) => {
            user.user_rank = index + 1;
        });

        // Apply limit
        const limitedStats = filteredStats.slice(0, parseInt(limit));

        res.status(200).json({
            success: true,
            data: limitedStats,
            total: filteredStats.length
        });

    } catch (error) {
        console.error('Error fetching global leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

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
