import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChangeRequestsService } from './change-requests.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateChangeRequestDto,
  ChangeRequestResponse,
  ChangeRequestListResponse,
  UserRole,
} from '@moaa/shared';

@Controller('change-requests')
@UseGuards(JwtAuthGuard)
export class ChangeRequestsController {
  constructor(private readonly changeRequestsService: ChangeRequestsService) {}

  @Post()
  async create(
    @Body() dto: CreateChangeRequestDto,
    @CurrentUser('id') userId: string
  ): Promise<ChangeRequestResponse> {
    return this.changeRequestsService.create(dto, userId);
  }

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string
  ): Promise<ChangeRequestListResponse> {
    return this.changeRequestsService.findAll(
      userId,
      userRole,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20
    );
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole
  ): Promise<ChangeRequestResponse> {
    return this.changeRequestsService.findById(id, userId, userRole);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole
  ): Promise<ChangeRequestResponse> {
    return this.changeRequestsService.approve(id, userId, userRole);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole
  ): Promise<ChangeRequestResponse> {
    return this.changeRequestsService.reject(id, userId, userRole);
  }
}
