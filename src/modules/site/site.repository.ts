import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SiteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return this.prisma.site.findMany({
        orderBy: { name: 'asc' },
      });
    }

    return this.prisma.site.findMany({
      where: {
        OR: [
          {
            name: {
              contains: normalizedQuery,
              mode: 'insensitive',
            },
          },
          {
            address: {
              contains: normalizedQuery,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: normalizedQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: { name: 'asc' },
    });
  }
}
