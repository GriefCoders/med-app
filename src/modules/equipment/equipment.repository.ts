import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EquipmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return this.prisma.equipment.findMany({
        include: {
          site: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    }

    return this.prisma.equipment.findMany({
      where: {
        OR: [
          {
            name: {
              contains: normalizedQuery,
              mode: 'insensitive',
            },
          },
          {
            inventoryNumber: {
              contains: normalizedQuery,
              mode: 'insensitive',
            },
          },
          {
            serialNumber: {
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
        name: 'asc',
      },
    });
  }

  async findOneById(id: string) {
    return this.prisma.equipment.findUnique({
      where: { id },
      include: {
        site: true,
      },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    inventoryNumber?: string;
    siteId: string;
    serialNumber?: string;
    state?: string;
    roomNumber?: string;
  }) {
    return this.prisma.equipment.create({
      data,
      include: {
        site: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      inventoryNumber?: string;
      siteId?: string;
      serialNumber?: string;
      state?: string;
      roomNumber?: string;
    },
  ) {
    return this.prisma.equipment.update({
      where: { id },
      data,
      include: {
        site: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.equipment.delete({
      where: { id },
    });
  }

  async getHistory(equipmentId: string) {
    return this.prisma.repair.findMany({
      where: { equipmentId },
      orderBy: {
        date: 'desc',
      },
    });
  }
}
