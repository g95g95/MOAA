import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectResponse, UserRole } from '@moaa/shared';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto, userId: string): Promise<ProjectResponse> {
    const project = await this.prisma.project.create({
      data: {
        ...dto,
        ownerId: userId,
      },
    });

    return this.toResponse(project);
  }

  async findAll(userId: string, userRole: UserRole): Promise<ProjectResponse[]> {
    const where = userRole === UserRole.SUPER_USER ? {} : { ownerId: userId };

    const projects = await this.prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return projects.map(this.toResponse);
  }

  async findById(
    id: string,
    userId: string,
    userRole: UserRole
  ): Promise<ProjectResponse> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (userRole !== UserRole.SUPER_USER && project.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.toResponse(project);
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    userId: string,
    userRole: UserRole
  ): Promise<ProjectResponse> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (userRole !== UserRole.SUPER_USER && project.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: dto,
    });

    return this.toResponse(updated);
  }

  async delete(id: string, userId: string, userRole: UserRole): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (userRole !== UserRole.SUPER_USER && project.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.project.delete({
      where: { id },
    });
  }

  private toResponse(project: {
    id: string;
    name: string;
    description: string | null;
    repositoryUrl: string;
    defaultBranch: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
  }): ProjectResponse {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      repositoryUrl: project.repositoryUrl,
      defaultBranch: project.defaultBranch,
      ownerId: project.ownerId,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }
}
