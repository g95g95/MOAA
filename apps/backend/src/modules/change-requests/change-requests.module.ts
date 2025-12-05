import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChangeRequestsService } from './change-requests.service';
import { ChangeRequestsController } from './change-requests.controller';
import { QueueService } from './queue.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [ChangeRequestsController],
  providers: [ChangeRequestsService, QueueService, PrismaService],
  exports: [ChangeRequestsService],
})
export class ChangeRequestsModule {}
