import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { QUEUE_NAMES, ChangeRequestJobData } from '@moaa/shared';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private changeRequestQueue: Queue<ChangeRequestJobData>;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');

    this.changeRequestQueue = new Queue<ChangeRequestJobData>(QUEUE_NAMES.CHANGE_REQUEST, {
      connection: {
        url: redisUrl,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });
  }

  async addChangeRequestJob(data: ChangeRequestJobData): Promise<string> {
    const job = await this.changeRequestQueue.add('process-change-request', data, {
      jobId: `cr-${data.changeRequestId}`,
    });

    return job.id ?? data.changeRequestId;
  }

  async onModuleDestroy() {
    await this.changeRequestQueue.close();
  }
}
