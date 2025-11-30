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

  async search(query: string) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return this.prisma.user.findMany({
        include: {
          site: true,
        },
        orderBy: {
          fullName: 'asc',
        },
      });
    }

    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            fullName: {
              contains: normalizedQuery,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: normalizedQuery,
              mode: 'insensitive',
            },
          },
          {
            roomNumber: {
              contains: normalizedQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        site: true,
      },
      orderBy: {
        fullName: 'asc',
      },
    });
  }
}
