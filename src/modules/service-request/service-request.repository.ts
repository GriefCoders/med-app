import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(where: Prisma.ServiceRequestWhereInput = {}) {
    return this.prisma.serviceRequest.findMany({
      where,
      include: {
        sender: {
          include: {
            site: true,
          },
        },
        assignee: true,
        equipment: true,
        site: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneById(id: string) {
    return this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        sender: {
          include: {
            site: true,
          },
        },
        assignee: true,
        equipment: true,
        site: true,
      },
    });
  }

  async create(data: Prisma.ServiceRequestCreateInput) {
    return this.prisma.serviceRequest.create({
      data,
      include: {
        sender: {
          include: {
            site: true,
          },
        },
        assignee: true,
        equipment: true,
        site: true,
      },
    });
  }

  async update(id: string, data: Prisma.ServiceRequestUpdateInput) {
    return this.prisma.serviceRequest.update({
      where: { id },
      data,
      include: {
        sender: {
          include: {
            site: true,
          },
        },
        assignee: true,
        equipment: true,
        site: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.serviceRequest.delete({
      where: { id },
    });
  }

  async getStats(where: Prisma.ServiceRequestWhereInput = {}) {
    const [byStatus, total] = await Promise.all([
      this.prisma.serviceRequest.groupBy({
        by: ['status'],
        _count: {
          _all: true,
        },
        where,
      }),
      this.prisma.serviceRequest.count({ where }),
    ]);

    return {
      total,
      byStatus,
    };
  }
}
