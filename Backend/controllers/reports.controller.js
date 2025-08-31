import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate mock data for demonstration
const generateMockData = (period) => {
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
        case '7days':
            startDate.setDate(now.getDate() - 7);
            break;
        case '30days':
            startDate.setDate(now.getDate() - 30);
            break;
        case '3months':
            startDate.setMonth(now.getMonth() - 3);
            break;
        case 'yearly':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        default:
            startDate.setDate(now.getDate() - 30);
    }

    const totalDuration = 18000000; // 5 hours in milliseconds
    const totalLinesChanged = 1250;
    const totalCharactersTyped = 45000;
    const totalSessions = 15;
    const totalFiles = 8;

    const languages = {
        'JavaScript': {
            duration: 7200000, // 2 hours
            files: 3,
            linesChanged: 500,
            charactersTyped: 18000,
            percentage: 40
        },
        'TypeScript': {
            duration: 5400000, // 1.5 hours
            files: 2,
            linesChanged: 400,
            charactersTyped: 15000,
            percentage: 30
        },
        'Python': {
            duration: 3600000, // 1 hour
            files: 2,
            linesChanged: 250,
            charactersTyped: 8000,
            percentage: 20
        },
        'CSS': {
            duration: 1800000, // 0.5 hours
            files: 1,
            linesChanged: 100,
            charactersTyped: 4000,
            percentage: 10
        }
    };

    const productiveHours = [
        { hour: 14, duration: 3600000, percentage: 20 },
        { hour: 10, duration: 2700000, percentage: 15 },
        { hour: 16, duration: 1800000, percentage: 10 },
        { hour: 9, duration: 900000, percentage: 5 },
        { hour: 20, duration: 450000, percentage: 2.5 }
    ];

    const projects = [
        {
            id: '1',
            name: 'ThePrimeTime Extension',
            duration: 9000000,
            linesChanged: 600,
            charactersTyped: 25000,
            sessions: 8,
            percentage: 50
        },
        {
            id: '2',
            name: 'Personal Portfolio',
            duration: 5400000,
            linesChanged: 400,
            charactersTyped: 15000,
            sessions: 5,
            percentage: 30
        },
        {
            id: '3',
            name: 'API Backend',
            duration: 3600000,
            linesChanged: 250,
            charactersTyped: 5000,
            sessions: 2,
            percentage: 20
        }
    ];

    return {
        period,
        summary: {
            totalDuration,
            totalLinesChanged,
            totalCharactersTyped,
            totalSessions,
            totalFiles,
            averageSessionDuration: totalDuration / totalSessions,
            averageLinesPerSession: totalLinesChanged / totalSessions,
            averageCharsPerSession: totalCharactersTyped / totalSessions
        },
        languages,
        dailyActivity: {},
        weeklyActivity: {},
        hourlyActivity: {},
        projects,
        productiveHours,
        insights: {
            mostUsedLanguage: 'JavaScript',
            mostProductiveHour: 14,
            totalProjects: 3,
            averageProjectDuration: totalDuration / 3
        }
    };
};

// Get comprehensive user reports
export const getUserReports = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string
        const { period = '30days' } = req.query;

        let startDate = new Date();
        switch (period) {
            case '7days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '3months':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case 'yearly':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        // Get coding statistics for the period
        const codingStats = await prisma.codingStats.findMany({
            where: {
                userId,
                timestamp: {
                    gte: startDate
                }
            },
            orderBy: { timestamp: 'desc' }
        });

        // If no real data exists, return empty data structure
        if (codingStats.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    period,
                    summary: {
                        totalDuration: 0,
                        totalLinesChanged: 0,
                        totalCharactersTyped: 0,
                        totalSessions: 0,
                        totalFiles: 0,
                        averageSessionDuration: 0,
                        averageLinesPerSession: 0,
                        averageCharsPerSession: 0
                    },
                    languages: {},
                    dailyActivity: {},
                    weeklyActivity: {},
                    hourlyActivity: {},
                    projects: [],
                    productiveHours: [],
                    insights: {
                        mostUsedLanguage: 'None',
                        mostProductiveHour: 0,
                        totalProjects: 0,
                        averageProjectDuration: 0
                    }
                },
                message: "No coding data available for this period. Connect your VS Code extension to start tracking your coding activity."
            });
        }

        // Calculate basic statistics
        const totalDuration = codingStats.reduce((sum, stat) => sum + stat.duration, 0);
        const totalLinesChanged = codingStats.reduce((sum, stat) => sum + stat.linesChanged, 0);
        const totalCharactersTyped = codingStats.reduce((sum, stat) => sum + stat.charactersTyped, 0);
        const totalSessions = codingStats.length;

        // Language statistics
        const languageStats = {};
        codingStats.forEach(stat => {
            if (languageStats[stat.language]) {
                languageStats[stat.language].duration += stat.duration;
                languageStats[stat.language].files.add(stat.fileName);
                languageStats[stat.language].linesChanged += stat.linesChanged;
                languageStats[stat.language].charactersTyped += stat.charactersTyped;
            } else {
                languageStats[stat.language] = {
                    duration: stat.duration,
                    files: new Set([stat.fileName]),
                    linesChanged: stat.linesChanged,
                    charactersTyped: stat.charactersTyped
                };
            }
        });

        // Convert Set to count and calculate percentages
        const totalFiles = new Set(codingStats.map(stat => stat.fileName)).size;
        Object.keys(languageStats).forEach(lang => {
            languageStats[lang].files = languageStats[lang].files.size;
            languageStats[lang].percentage = (languageStats[lang].duration / totalDuration) * 100;
        });

        // Daily activity for the period
        const dailyActivity = {};
        codingStats.forEach(stat => {
            const date = stat.timestamp.toISOString().split('T')[0];
            if (dailyActivity[date]) {
                dailyActivity[date] += stat.duration;
            } else {
                dailyActivity[date] = stat.duration;
            }
        });

        // Weekly activity
        const weeklyActivity = {};
        codingStats.forEach(stat => {
            const date = new Date(stat.timestamp);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = weekStart.toISOString().split('T')[0];
            
            if (weeklyActivity[weekKey]) {
                weeklyActivity[weekKey] += stat.duration;
            } else {
                weeklyActivity[weekKey] = stat.duration;
            }
        });

        // Hourly activity pattern
        const hourlyActivity = {};
        codingStats.forEach(stat => {
            const hour = new Date(stat.timestamp).getHours();
            if (hourlyActivity[hour]) {
                hourlyActivity[hour] += stat.duration;
            } else {
                hourlyActivity[hour] = stat.duration;
            }
        });

        // Project statistics
        const projectStats = await prisma.project.findMany({
            where: { userId },
            include: {
                codingStats: {
                    where: {
                        timestamp: {
                            gte: startDate
                        }
                    },
                    select: {
                        duration: true,
                        linesChanged: true,
                        charactersTyped: true
                    }
                }
            }
        });

        const projectsWithStats = projectStats.map(project => {
            const projectDuration = project.codingStats.reduce((sum, stat) => sum + stat.duration, 0);
            const projectLines = project.codingStats.reduce((sum, stat) => sum + stat.linesChanged, 0);
            const projectChars = project.codingStats.reduce((sum, stat) => sum + stat.charactersTyped, 0);
            
            return {
                id: project.id,
                name: project.name,
                duration: projectDuration,
                linesChanged: projectLines,
                charactersTyped: projectChars,
                sessions: project.codingStats.length,
                percentage: totalDuration > 0 ? (projectDuration / totalDuration) * 100 : 0
            };
        }).sort((a, b) => b.duration - a.duration);

        // Productivity insights
        const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
        const averageLinesPerSession = totalSessions > 0 ? totalLinesChanged / totalSessions : 0;
        const averageCharsPerSession = totalSessions > 0 ? totalCharactersTyped / totalSessions : 0;

        // Most productive hours
        const productiveHours = Object.entries(hourlyActivity)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([hour, duration]) => ({
                hour: parseInt(hour),
                duration,
                percentage: (duration / totalDuration) * 100
            }));

        res.status(200).json({
            success: true,
            data: {
                period,
                summary: {
                    totalDuration,
                    totalLinesChanged,
                    totalCharactersTyped,
                    totalSessions,
                    totalFiles,
                    averageSessionDuration,
                    averageLinesPerSession,
                    averageCharsPerSession
                },
                languages: languageStats,
                dailyActivity,
                weeklyActivity,
                hourlyActivity,
                projects: projectsWithStats,
                productiveHours,
                insights: {
                    mostUsedLanguage: Object.keys(languageStats).sort((a, b) => 
                        languageStats[b].duration - languageStats[a].duration
                    )[0] || 'None',
                    mostProductiveHour: productiveHours[0]?.hour || 0,
                    totalProjects: projectStats.length,
                    averageProjectDuration: projectStats.length > 0 ? 
                        totalDuration / projectStats.length : 0
                }
            }
        });
    } catch (error) {
        console.error('Error generating user reports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get detailed project report
export const getProjectReport = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string
        const { projectId } = req.params;
        const { period = '30days' } = req.query;

        let startDate = new Date();
        switch (period) {
            case '7days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '3months':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case 'yearly':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        const project = await prisma.project.findFirst({
            where: { id: projectId, userId },
            include: {
                codingStats: {
                    where: {
                        timestamp: {
                            gte: startDate
                        }
                    },
                    orderBy: { timestamp: 'desc' }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const stats = project.codingStats;
        const totalDuration = stats.reduce((sum, stat) => sum + stat.duration, 0);
        const totalLinesChanged = stats.reduce((sum, stat) => sum + stat.linesChanged, 0);
        const totalCharactersTyped = stats.reduce((sum, stat) => sum + stat.charactersTyped, 0);

        // Language breakdown
        const languageBreakdown = {};
        stats.forEach(stat => {
            if (languageBreakdown[stat.language]) {
                languageBreakdown[stat.language].duration += stat.duration;
                languageBreakdown[stat.language].files.add(stat.fileName);
                languageBreakdown[stat.language].linesChanged += stat.linesChanged;
            } else {
                languageBreakdown[stat.language] = {
                    duration: stat.duration,
                    files: new Set([stat.fileName]),
                    linesChanged: stat.linesChanged
                };
            }
        });

        Object.keys(languageBreakdown).forEach(lang => {
            languageBreakdown[lang].files = languageBreakdown[lang].files.size;
            languageBreakdown[lang].percentage = (languageBreakdown[lang].duration / totalDuration) * 100;
        });

        // File activity
        const fileActivity = {};
        stats.forEach(stat => {
            if (fileActivity[stat.fileName]) {
                fileActivity[stat.fileName].duration += stat.duration;
                fileActivity[stat.fileName].linesChanged += stat.linesChanged;
                fileActivity[stat.fileName].sessions += 1;
            } else {
                fileActivity[stat.fileName] = {
                    duration: stat.duration,
                    linesChanged: stat.linesChanged,
                    sessions: 1,
                    language: stat.language
                };
            }
        });

        // Daily activity
        const dailyActivity = {};
        stats.forEach(stat => {
            const date = stat.timestamp.toISOString().split('T')[0];
            if (dailyActivity[date]) {
                dailyActivity[date] += stat.duration;
            } else {
                dailyActivity[date] = stat.duration;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                project: {
                    id: project.id,
                    name: project.name,
                    description: project.description
                },
                period,
                summary: {
                    totalDuration,
                    totalLinesChanged,
                    totalCharactersTyped,
                    totalSessions: stats.length,
                    averageSessionDuration: stats.length > 0 ? totalDuration / stats.length : 0
                },
                languageBreakdown,
                fileActivity: Object.entries(fileActivity)
                    .map(([fileName, data]) => ({
                        fileName,
                        ...data
                    }))
                    .sort((a, b) => b.duration - a.duration)
                    .slice(0, 10),
                dailyActivity
            }
        });
    } catch (error) {
        console.error('Error generating project report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 