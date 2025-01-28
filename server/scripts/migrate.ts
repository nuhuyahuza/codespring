import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function checkMigrationStatus() {
  try {
    const { stdout } = await execAsync('yarn prisma migrate status');
    return !stdout.includes('No migrations found');
  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
}

async function safeMigrate() {
  try {
    console.log('Checking existing migrations...');
    const hasMigrations = await checkMigrationStatus();

    if (!hasMigrations) {
      console.log('No existing migrations found. Running initial migration...');
      await execAsync('yarn prisma migrate dev --name init');
      console.log('Initial migration complete!');
      return;
    }

    console.log('Checking for pending migrations...');
    const { stdout: status } = await execAsync('yarn prisma migrate status');
    
    if (status.includes('Database schema is up to date')) {
      console.log('Database schema is already up to date!');
      return;
    }

    console.log('Applying pending migrations...');
    await execAsync('yarn prisma migrate deploy');
    console.log('Migrations applied successfully!');

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

safeMigrate(); 