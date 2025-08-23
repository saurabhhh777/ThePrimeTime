import { PrismaClient } from '@prisma/client';
import { isAuth } from '../middlewares/isAuth.middle.js';

const prisma = new PrismaClient();

// Get all projects for a user
export const getUserProjects = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string
        
        const projects = await prisma.project.findMany({
            where: { userId },
            include: {
                codingStats: {
                    select: {
                        duration: true,
                        linesChanged: true,
                        charactersTyped: true,
                        timestamp: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Calculate project statistics
        const projectsWithStats = projects.map(project => {
            const totalDuration = project.codingStats.reduce((sum, stat) => sum + stat.duration, 0);
            const totalLinesChanged = project.codingStats.reduce((sum, stat) => sum + stat.linesChanged, 0);
            const totalCharactersTyped = project.codingStats.reduce((sum, stat) => sum + stat.charactersTyped, 0);
            const lastActivity = project.codingStats.length > 0 
                ? Math.max(...project.codingStats.map(stat => new Date(stat.timestamp).getTime()))
                : null;

            return {
                id: project.id,
                name: project.name,
                description: project.description,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                stats: {
                    totalDuration,
                    totalLinesChanged,
                    totalCharactersTyped,
                    sessions: project.codingStats.length,
                    lastActivity: lastActivity ? new Date(lastActivity) : null
                }
            };
        });

        res.status(200).json({
            success: true,
            data: projectsWithStats
        });
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new project
export const createProject = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const project = await prisma.project.create({
            data: {
                name,
                description: description || '',
                userId
            }
        });

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a project
export const updateProject = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string
        const { id } = req.params;
        const { name, description } = req.body;

        const project = await prisma.project.findFirst({
            where: { id, userId }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                name: name || project.name,
                description: description !== undefined ? description : project.description
            }
        });

        res.status(200).json({
            success: true,
            data: updatedProject
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a project
export const deleteProject = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string
        const { id } = req.params;

        const project = await prisma.project.findFirst({
            where: { id, userId }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await prisma.project.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get project details with detailed statistics
export const getProjectDetails = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Convert MongoDB ObjectId to string
        const { id } = req.params;

        const project = await prisma.project.findFirst({
            where: { id, userId },
            include: {
                codingStats: {
                    select: {
                        duration: true,
                        linesChanged: true,
                        charactersTyped: true,
                        timestamp: true,
                        language: true,
                        fileName: true
                    },
                    orderBy: { timestamp: 'desc' }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Calculate detailed statistics
        const totalDuration = project.codingStats.reduce((sum, stat) => sum + stat.duration, 0);
        const totalLinesChanged = project.codingStats.reduce((sum, stat) => sum + stat.linesChanged, 0);
        const totalCharactersTyped = project.codingStats.reduce((sum, stat) => sum + stat.charactersTyped, 0);
        
        // Language statistics
        const languageStats = {};
        project.codingStats.forEach(stat => {
            if (languageStats[stat.language]) {
                languageStats[stat.language].duration += stat.duration;
                languageStats[stat.language].files.add(stat.fileName);
            } else {
                languageStats[stat.language] = {
                    duration: stat.duration,
                    files: new Set([stat.fileName])
                };
            }
        });

        // Convert Set to count
        Object.keys(languageStats).forEach(lang => {
            languageStats[lang].files = languageStats[lang].files.size;
        });

        // Daily activity for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const dailyActivity = {};
        project.codingStats
            .filter(stat => new Date(stat.timestamp) >= thirtyDaysAgo)
            .forEach(stat => {
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
                    description: project.description,
                    createdAt: project.createdAt,
                    updatedAt: project.updatedAt
                },
                stats: {
                    totalDuration,
                    totalLinesChanged,
                    totalCharactersTyped,
                    sessions: project.codingStats.length,
                    languages: languageStats,
                    dailyActivity
                }
            }
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
