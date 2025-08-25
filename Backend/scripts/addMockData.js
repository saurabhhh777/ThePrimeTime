import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addMockCodingStats() {
  try {
    // Get the user ID from the database
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found. Please create a user first.');
      return;
    }

    const userId = user.id; // Use the first user's ID dynamically
    console.log(`Adding mock data for user: ${userId}`);

    // Mock coding stats data
    const mockStats = [
      // Recent data (last 7 days)
      {
        userId,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        fileName: 'Dashboard.tsx',
        filePath: '/src/pages',
        language: 'TypeScript',
        folder: '/src/pages',
        duration: 45 * 60 * 1000, // 45 minutes
        linesChanged: 120,
        charactersTyped: 3500
      },
      {
        userId,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        fileName: 'Profile.tsx',
        filePath: '/src/pages',
        language: 'TypeScript',
        folder: '/src/pages',
        duration: 90 * 60 * 1000, // 1.5 hours
        linesChanged: 200,
        charactersTyped: 6000
      },
      {
        userId,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        fileName: 'index.js',
        filePath: '/src',
        language: 'JavaScript',
        folder: '/src',
        duration: 2 * 60 * 60 * 1000, // 2 hours
        linesChanged: 150,
        charactersTyped: 5000
      },
      {
        userId,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        fileName: 'App.tsx',
        filePath: '/src',
        language: 'TypeScript',
        folder: '/src',
        duration: 3 * 60 * 60 * 1000, // 3 hours
        linesChanged: 200,
        charactersTyped: 8000
      },
      {
        userId,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        fileName: 'styles.css',
        filePath: '/src',
        language: 'CSS',
        folder: '/src',
        duration: 1.5 * 60 * 60 * 1000, // 1.5 hours
        linesChanged: 80,
        charactersTyped: 3000
      },
      {
        userId,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        fileName: 'utils.js',
        filePath: '/src/utils',
        language: 'JavaScript',
        folder: '/src/utils',
        duration: 1 * 60 * 60 * 1000, // 1 hour
        linesChanged: 120,
        charactersTyped: 4000
      },
      {
        userId,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        fileName: 'api.js',
        filePath: '/src/api',
        language: 'JavaScript',
        folder: '/src/api',
        duration: 2.5 * 60 * 60 * 1000, // 2.5 hours
        linesChanged: 180,
        charactersTyped: 6000
      },
      {
        userId,
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        fileName: 'components.jsx',
        filePath: '/src/components',
        language: 'JavaScript',
        folder: '/src/components',
        duration: 4 * 60 * 60 * 1000, // 4 hours
        linesChanged: 300,
        charactersTyped: 12000
      },
      {
        userId,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        fileName: 'database.js',
        filePath: '/backend',
        language: 'JavaScript',
        folder: '/backend',
        duration: 3.5 * 60 * 60 * 1000, // 3.5 hours
        linesChanged: 250,
        charactersTyped: 9000
      },
      // Additional data for variety
      {
        userId,
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        fileName: 'config.py',
        filePath: '/backend/config',
        language: 'Python',
        folder: '/backend/config',
        duration: 1.8 * 60 * 60 * 1000, // 1.8 hours
        linesChanged: 95,
        charactersTyped: 3200
      },
      {
        userId,
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        fileName: 'schema.prisma',
        filePath: '/backend/prisma',
        language: 'Prisma',
        folder: '/backend/prisma',
        duration: 2.2 * 60 * 60 * 1000, // 2.2 hours
        linesChanged: 140,
        charactersTyped: 4500
      },
      {
        userId,
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        fileName: 'package.json',
        filePath: '/frontend',
        language: 'JSON',
        folder: '/frontend',
        duration: 30 * 60 * 1000, // 30 minutes
        linesChanged: 25,
        charactersTyped: 800
      }
    ];

    // Insert mock data
    for (const stat of mockStats) {
      await prisma.codingStats.create({
        data: stat
      });
    }

    console.log('Mock coding stats data added successfully!');
    console.log(`Added ${mockStats.length} coding sessions`);

    // Calculate total time
    const totalTime = mockStats.reduce((sum, stat) => sum + stat.duration, 0);
    const totalHours = totalTime / (1000 * 60 * 60);
    console.log(`Total coding time: ${totalHours.toFixed(1)} hours`);

  } catch (error) {
    console.error('Error adding mock data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMockCodingStats(); 