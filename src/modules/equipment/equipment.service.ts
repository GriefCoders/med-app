import { Injectable, NotFoundException } from '@nestjs/common';
import { EquipmentRepository } from './equipment.repository';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EquipmentService {
  constructor(
    private readonly equipmentRepository: EquipmentRepository,
    private readonly prisma: PrismaService,
  ) {}

  async search(query: string) {
    return this.equipmentRepository.search(query);
  }

  async findOneById(id: string) {
    const equipment = await this.equipmentRepository.findOneById(id);

    if (!equipment) {
      throw new NotFoundException('Инвентарь не найден');
    }

    return equipment;
  }

  async create(dto: CreateEquipmentDto) {
    const site = await this.prisma.site.findUnique({
      where: { id: dto.siteId },
    });

    if (!site) {
      throw new NotFoundException('Отделение не найдено');
    }

    return this.equipmentRepository.create(dto);
  }

  async update(id: string, dto: UpdateEquipmentDto) {
    const equipment = await this.equipmentRepository.findOneById(id);

    if (!equipment) {
      throw new NotFoundException('Инвентарь не найден');
    }

    if (dto.siteId && dto.siteId !== equipment.siteId) {
      const site = await this.prisma.site.findUnique({
        where: { id: dto.siteId },
      });

      if (!site) {
        throw new NotFoundException('Отделение не найдено');
      }
    }

    return this.equipmentRepository.update(id, {
      name: dto.name ?? undefined,
      description: dto.description ?? undefined,
      inventoryNumber: dto.inventoryNumber ?? undefined,
      siteId: dto.siteId ?? undefined,
      serialNumber: dto.serialNumber ?? undefined,
      state: dto.state ?? undefined,
      roomNumber: dto.roomNumber ?? undefined,
    });
  }

  async delete(id: string) {
    const equipment = await this.equipmentRepository.findOneById(id);

    if (!equipment) {
      throw new NotFoundException('Инвентарь не найден');
    }

    await this.equipmentRepository.delete(id);
  }

  async getHistory(id: string) {
    const equipment = await this.equipmentRepository.findOneById(id);

    if (!equipment) {
      throw new NotFoundException('Инвентарь не найден');
    }

    return this.equipmentRepository.getHistory(id);
  }
}
