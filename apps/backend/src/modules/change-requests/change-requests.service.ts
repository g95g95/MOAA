import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { QueueService } from './queue.service';
import {
  CreateChangeRequestDto,
  ChangeRequestResponse,
  ChangeRequestListResponse,
  ChangeRequestStatus,
  UserRole,
} from '@moaa/shared';

@Injectable()
export class ChangeRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService
  ) {}

  async create(
    dto: CreateChangeRequestDto,
    authorId: string
  ): Promise<ChangeRequestResponse> {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const changeRequest = await this.prisma.changeRequest.create({
      data: {
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        authorId,
      },
    });

    await this.queueService.addChangeRequestJob({
      changeRequestId: changeRequest.id,
      projectId: project.id,
      description: dto.description,
      repositoryUrl: project.repositoryUrl,
      defaultBranch: project.defaultBranch,
    });

    await this.prisma.changeRequest.update({
      where: { id: changeRequest.id },
      data: { status: ChangeRequestStatus.PROCESSING },
    });

    return this.toResponse(changeRequest);
  }

  async findAll(
    userId: string,
    userRole: UserRole,
    page = 1,
    pageSize = 20
  ): Promise<ChangeRequestListResponse> {
    const where = userRole === UserRole.SUPER_USER ? {} : { authorId: userId };

    const [items, total] = await Promise.all([
      this.prisma.changeRequest.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.changeRequest.count({ where }),
    ]);

    return {
      items: items.map(this.toResponse),
      total,
      page,
      pageSize,
    };
  }

  async findById(
    id: string,
    userId: string,
    userRole: UserRole
  ): Promise<ChangeRequestResponse> {
    const changeRequest = await this.prisma.changeRequest.findUnique({
      where: { id },
    });

    if (!changeRequest) {
      throw new NotFoundException('Change request not found');
    }

    if (userRole !== UserRole.SUPER_USER && changeRequest.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.toResponse(changeRequest);
  }

  async approve(id: string, userId: string, userRole: UserRole): Promise<ChangeRequestResponse> {
    const changeRequest = await this.findChangeRequest(id, userId, userRole);

    if (changeRequest.status !== ChangeRequestStatus.AWAITING_REVIEW) {
      throw new BadRequestException('Change request is not awaiting review');
    }

    const updated = await this.prisma.changeRequest.update({
      where: { id },
      data: { status: ChangeRequestStatus.APPROVED },
    });

    return this.toResponse(updated);
  }

  async reject(id: string, userId: string, userRole: UserRole): Promise<ChangeRequestResponse> {
    const changeRequest = await this.findChangeRequest(id, userId, userRole);

    if (changeRequest.status !== ChangeRequestStatus.AWAITING_REVIEW) {
      throw new BadRequestException('Change request is not awaiting review');
    }

    const updated = await this.prisma.changeRequest.update({
      where: { id },
      data: { status: ChangeRequestStatus.REJECTED },
    });

    return this.toResponse(updated);
  }

  private async findChangeRequest(id: string, userId: string, userRole: UserRole) {
    const changeRequest = await this.prisma.changeRequest.findUnique({
      where: { id },
    });

    if (!changeRequest) {
      throw new NotFoundException('Change request not found');
    }

    if (userRole !== UserRole.SUPER_USER && changeRequest.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return changeRequest;
  }

  private toResponse(cr: {
    id: string;
    title: string;
    description: string;
    status: ChangeRequestStatus;
    projectId: string;
    authorId: string;
    branchName: string | null;
    previewUrl: string | null;
    diffContent: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): ChangeRequestResponse {
    return {
      id: cr.id,
      title: cr.title,
      description: cr.description,
      status: cr.status,
      projectId: cr.projectId,
      authorId: cr.authorId,
      branchName: cr.branchName,
      previewUrl: cr.previewUrl,
      diffContent: cr.diffContent,
      createdAt: cr.createdAt.toISOString(),
      updatedAt: cr.updatedAt.toISOString(),
    };
  }
}
