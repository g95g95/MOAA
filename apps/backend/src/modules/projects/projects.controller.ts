import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateProjectDto, UpdateProjectDto, ProjectResponse, UserRole } from '@moaa/shared';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() dto: CreateProjectDto,
    @CurrentUser('id') userId: string
  ): Promise<ProjectResponse> {
    return this.projectsService.create(dto, userId);
  }

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole
  ): Promise<ProjectResponse[]> {
    return this.projectsService.findAll(userId, userRole);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole
  ): Promise<ProjectResponse> {
    return this.projectsService.findById(id, userId, userRole);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole
  ): Promise<ProjectResponse> {
    return this.projectsService.update(id, dto, userId, userRole);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole
  ): Promise<void> {
    return this.projectsService.delete(id, userId, userRole);
  }
}
