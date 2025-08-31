import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearMockData() {
  try {
    console.log('Clearing all mock coding stats data...');

    // Delete all coding stats records
    const deletedCount = await prisma.codingStats.deleteMany({});
    
    console.log(`Successfully deleted ${deletedCount.count} coding stats records`);
    console.log('Database is now clean - only real data will be shown');

  } catch (error) {
    console.error('Error clearing mock data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearMockData(); 