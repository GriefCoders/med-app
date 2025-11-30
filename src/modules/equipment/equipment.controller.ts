import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@ApiTags('Инвентарь')
@Controller('equipment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @ApiOperation({ summary: 'Поиск по инвентарю' })
  @ApiQuery({
    name: 'query',
    required: false,
    description:
      'Строка поиска. Ищет по названию, инвентарному номеру, серийному номеру и номеру комнаты. Если не указана — вернёт весь инвентарь.',
  })
  async search(@Query('query') query = '') {
    return this.equipmentService.search(query);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Создание инвентаря (только администратор)' })
  @ApiBody({ type: CreateEquipmentDto })
  async create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение инвентаря по идентификатору' })
  async getById(@Param('id') id: string) {
    return this.equipmentService.findOneById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Обновление инвентаря (только администратор)' })
  @ApiBody({ type: UpdateEquipmentDto })
  async update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto) {
    return this.equipmentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(204)
  @ApiOperation({ summary: 'Удаление инвентаря (только администратор)' })
  async delete(@Param('id') id: string) {
    await this.equipmentService.delete(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Получение истории ремонтов инвентаря' })
  async getHistory(@Param('id') id: string) {
    return this.equipmentService.getHistory(id);
  }
}
