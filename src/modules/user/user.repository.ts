import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        site: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        site: true,
      },
    });
  }

  async create(data: {
    fullName: string;
    email: string;
    password: string;
    role: Role;
    siteId: string;
    roomNumber?: string;
  }) {
    return this.prisma.user.create({
      data,
      include: {
        site: true,
      },
    });
  }
}
