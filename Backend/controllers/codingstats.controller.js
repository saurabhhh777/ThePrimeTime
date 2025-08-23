import { PrismaClient } from '@prisma/client';
import { isAuth } from '../middlewares/isAuth.middle.js';
import { hybridDB } from '../config/hybridDB.js';

const prisma = new PrismaClient();

// Submit coding statistics
export const submitCodingStats = async (req, res) => {
    try {
        const { userId, timestamp, fileName, filePath, language, folder, duration, linesChanged, charactersTyped } = req.body;

        // Validate required fields
        if (!userId || !fileName || !language || !duration) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create coding stats record in both databases
        const codingStatsData = {
            userId,
            timestamp: new Date(timestamp),
            fileName,
            filePath,
            language,
            folder,
            duration,
            linesChanged: linesChanged || 0,
            charactersTyped: charactersTyped || 0
        };

        // Save to PostgreSQL (Prisma)
        const postgresStats = await prisma.codingStats.create({
            data: codingStatsData
        });

        // Save to MongoDB
        const mongoStats = await hybridDB.saveToMongoDB('codingStats', codingStatsData);

        res.status(201).json({ 
            success: true, 
            data: {
                postgreSQL: postgresStats,
                mongoDB: mongoStats
            }
        });
    } catch (error) {
        console.error('Error submitting coding stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user's coding statistics with date filtering
export const getCodingStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate, period } = req.query;

        let whereClause = { userId };
        let dateFilter = {};

        // Handle different period types
        if (period === '30days') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            dateFilter = {
                gte: thirtyDaysAgo
            };
        } else if (period === '3months') {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            dateFilter = {
                gte: threeMonthsAgo
            };
        } else if (period === 'yearly') {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            dateFilter = {
                gte: oneYearAgo
            };
        } else if (startDate && endDate) {
            dateFilter = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        } else {
            // Default to 30 days for free users
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            dateFilter = {
                gte: thirtyDaysAgo
            };
        }

        whereClause.timestamp = dateFilter;

        // Check user subscription for extended data access
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { subscriptionType: true }
        });

        // For free users, limit to 30 days regardless of requested period
        if (user.subscriptionType === 'FREE' && period !== '30days' && (!startDate || !endDate)) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            whereClause.timestamp = {
                gte: thirtyDaysAgo
            };
        }

        const codingStats = await prisma.codingStats.findMany({
            where: whereClause,
            orderBy: { timestamp: 'desc' }
        });

        // Calculate summary statistics
        const totalDuration = codingStats.reduce((sum, stat) => sum + stat.duration, 0);
        const totalLinesChanged = codingStats.reduce((sum, stat) => sum + stat.linesChanged, 0);
        const totalCharactersTyped = codingStats.reduce((sum, stat) => sum + stat.charactersTyped, 0);

        // Group by language
        const languageStats = codingStats.reduce((acc, stat) => {
            if (!acc[stat.language]) {
                acc[stat.language] = { duration: 0, files: new Set(), linesChanged: 0, charactersTyped: 0 };
            }
            acc[stat.language].duration += stat.duration;
            acc[stat.language].files.add(stat.fileName);
            acc[stat.language].linesChanged += stat.linesChanged;
            acc[stat.language].charactersTyped += stat.charactersTyped;
            return acc;
        }, {});

        // Convert sets to counts
        Object.keys(languageStats).forEach(lang => {
            languageStats[lang].files = languageStats[lang].files.size;
        });

        // Group by folder
        const folderStats = codingStats.reduce((acc, stat) => {
            if (!acc[stat.folder]) {
                acc[stat.folder] = { duration: 0, files: new Set(), linesChanged: 0, charactersTyped: 0 };
            }
            acc[stat.folder].duration += stat.duration;
            acc[stat.folder].files.add(stat.fileName);
            acc[stat.folder].linesChanged += stat.linesChanged;
            acc[stat.folder].charactersTyped += stat.charactersTyped;
            return acc;
        }, {});

        // Convert sets to counts
        Object.keys(folderStats).forEach(folder => {
            folderStats[folder].files = folderStats[folder].files.size;
        });

        res.json({
            success: true,
            data: {
                codingStats,
                summary: {
                    totalDuration,
                    totalLinesChanged,
                    totalCharactersTyped,
                    totalSessions: codingStats.length,
                    averageSessionDuration: codingStats.length > 0 ? totalDuration / codingStats.length : 0
                },
                languageStats,
                folderStats,
                userSubscription: user.subscriptionType
            }
        });
    } catch (error) {
        console.error('Error fetching coding stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get coding statistics by language
export const getLanguageStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { period } = req.query;

        let dateFilter = {};
        if (period === '30days') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            dateFilter = { gte: thirtyDaysAgo };
        }

        const codingStats = await prisma.codingStats.findMany({
            where: {
                userId,
                timestamp: dateFilter
            }
        });

        const languageStats = codingStats.reduce((acc, stat) => {
            if (!acc[stat.language]) {
                acc[stat.language] = { duration: 0, files: new Set(), linesChanged: 0, charactersTyped: 0 };
            }
            acc[stat.language].duration += stat.duration;
            acc[stat.language].files.add(stat.fileName);
            acc[stat.language].linesChanged += stat.linesChanged;
            acc[stat.language].charactersTyped += stat.charactersTyped;
            return acc;
        }, {});

        // Convert to array format for easier frontend consumption
        const languageArray = Object.keys(languageStats).map(language => ({
            language,
            duration: languageStats[language].duration,
            files: languageStats[language].files.size,
            linesChanged: languageStats[language].linesChanged,
            charactersTyped: languageStats[language].charactersTyped
        }));

        res.json({
            success: true,
            data: languageArray
        });
    } catch (error) {
        console.error('Error fetching language stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get daily coding activity
export const getDailyActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const codingStats = await prisma.codingStats.findMany({
            where: {
                userId,
                timestamp: {
                    gte: startDate
                }
            },
            orderBy: { timestamp: 'asc' }
        });

        // Group by date
        const dailyStats = codingStats.reduce((acc, stat) => {
            const date = stat.timestamp.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { duration: 0, sessions: 0, linesChanged: 0, charactersTyped: 0 };
            }
            acc[date].duration += stat.duration;
            acc[date].sessions += 1;
            acc[date].linesChanged += stat.linesChanged;
            acc[date].charactersTyped += stat.charactersTyped;
            return acc;
        }, {});

        res.json({
            success: true,
            data: dailyStats
        });
    } catch (error) {
        console.error('Error fetching daily activity:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 