import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ServiceRequestRepository } from './service-request.repository';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { AssignServiceRequestDto } from './dto/assign-service-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import type { User } from 'src/types/user';
import { UserService } from '../user/user.service';
import { ServiceRequestStatus } from 'src/types/service-request-status';

@Injectable()
export class ServiceRequestService {
  constructor(
    private readonly repository: ServiceRequestRepository,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getAll(user: User, status?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (user.role === Role.ENGINEER) {
      where.siteId = user.siteId;
    }

    return this.repository.findMany(where);
  }

  async create(dto: CreateServiceRequestDto, user: User) {
    if (dto.equipmentId) {
      const equipment = await this.prisma.equipment.findUnique({
        where: { id: dto.equipmentId },
      });

      if (!equipment || equipment.siteId !== user.siteId) {
        throw new NotFoundException('Оборудование не найдено');
      }
    }

    const freeEngineer = await this.prisma.user.findFirst({
      where: {
        role: Role.ENGINEER,
        siteId: user.siteId,
        assignedRequests: {
          none: {
            status: ServiceRequestStatus.IN_PROGRESS,
          },
        },
      },
    });

    return this.repository.create({
      summary: dto.summary,
      description: dto.description,
      type: dto.type,
      priority: dto.priority,
      sender: {
        connect: { id: user.id },
      },
      equipment: dto.equipmentId
        ? { connect: { id: dto.equipmentId } }
        : undefined,
      site: {
        connect: { id: user.siteId },
      },
      assignee: freeEngineer
        ? {
            connect: { id: freeEngineer.id },
          }
        : undefined,
      status: ServiceRequestStatus.OPEN,
    });
  }

  async getById(id: string, user: User) {
    const request = await this.repository.findOneById(id);

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    const isSender = request.senderId === user.id;
    const isAssignee = request.assigneeId === user.id;
    const isSameSite = request.siteId === user.siteId;

    if (user.role !== Role.ADMIN && !isSender && !isAssignee && !isSameSite) {
      throw new ForbiddenException('Недостаточно прав для просмотра заявки');
    }

    return request;
  }

  async update(id: string, dto: UpdateServiceRequestDto, user: User) {
    const request = await this.repository.findOneById(id);

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (user.role !== Role.ADMIN && request.siteId !== user.siteId) {
      throw new ForbiddenException('Недостаточно прав для изменения заявки');
    }

    if (dto.equipmentId) {
      const equipment = await this.prisma.equipment.findUnique({
        where: { id: dto.equipmentId },
      });

      if (!equipment || equipment.siteId !== request.siteId) {
        throw new NotFoundException('Оборудование не найдено');
      }
    }

    return this.repository.update(id, {
      summary: dto.summary ?? undefined,
      description: dto.description ?? undefined,
      type: dto.type ?? undefined,
      priority: dto.priority ?? undefined,
      equipment: dto.equipmentId
        ? { connect: { id: dto.equipmentId } }
        : dto.equipmentId === null
          ? { disconnect: true }
          : undefined,
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateServiceRequestStatusDto,
    user: User,
  ) {
    const request = await this.repository.findOneById(id);

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (user.role === Role.ENGINEER && request.siteId !== user.siteId) {
      throw new ForbiddenException('Недостаточно прав для изменения статуса');
    }

    return this.repository.update(id, {
      status: dto.status,
    });
  }

  async assign(id: string, dto: AssignServiceRequestDto) {
    const request = await this.repository.findOneById(id);

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    const assignee = await this.userService.findOneById(dto.assigneeId);

    if (assignee.role !== Role.ENGINEER) {
      throw new ForbiddenException('Назначать можно только инженера');
    }

    if (assignee.siteId !== request.siteId) {
      throw new ForbiddenException(
        'Инженер должен принадлежать тому же отделению, что и заявка',
      );
    }

    return this.repository.update(id, {
      assignee: {
        connect: { id: assignee.id },
      },
    });
  }

  async getMy(user: User) {
    if (user.role === Role.USER) {
      return this.repository.findMany({
        senderId: user.id,
      });
    }

    if (user.role === Role.ENGINEER) {
      return this.repository.findMany({
        assigneeId: user.id,
      });
    }

    return this.repository.findMany();
  }

  async getStats(user: User) {
    const where: any = {};

    if (user.role === Role.ENGINEER) {
      where.siteId = user.siteId;
    }

    return this.repository.getStats(where);
  }
}
