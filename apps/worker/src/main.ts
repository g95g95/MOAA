import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { QUEUE_NAMES, ChangeRequestJobData } from '@moaa/shared';
import { processChangeRequest } from './jobs/change-request.job.js';
import { getRedisConnection } from './config/redis.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting MOAA Worker...');

  const connection = getRedisConnection();

  const changeRequestWorker = new Worker<ChangeRequestJobData>(
    QUEUE_NAMES.CHANGE_REQUEST,
    async (job) => {
      console.log(`Processing job ${job.id}: ${job.data.changeRequestId}`);
      await processChangeRequest(job.data, prisma);
    },
    {
      connection,
      concurrency: 2,
    }
  );

  changeRequestWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  changeRequestWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  changeRequestWorker.on('error', (err) => {
    console.error('Worker error:', err);
  });

  console.log('Worker is running and waiting for jobs...');

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down...');
    await changeRequestWorker.close();
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down...');
    await changeRequestWorker.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});
