import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { UserResponse, UpdateUserDto, UserRole } from '@moaa/shared';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user: UserRecord) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }));
  }
}
