import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ChangeRequestsModule } from './modules/change-requests/change-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    ChangeRequestsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
