import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
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
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { AssignServiceRequestDto } from './dto/assign-service-request.dto';
import { DecodeUser } from 'src/decorators/decode-user.decorator';
import type { User } from 'src/types/user';

@ApiTags('Заявки')
@Controller('service-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServiceRequestController {
  constructor(private readonly service: ServiceRequestService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ENGINEER)
  @ApiOperation({ summary: 'Получение списка заявок' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Фильтр по статусу заявки',
  })
  async getAll(@DecodeUser() user: User, @Query('status') status?: string) {
    return this.service.getAll(user, status);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Создание заявки на обслуживание' })
  @ApiBody({ type: CreateServiceRequestDto })
  async create(@DecodeUser() user: User, @Body() dto: CreateServiceRequestDto) {
    return this.service.create(dto, user);
  }

  @Get('my')
  @ApiOperation({ summary: 'Получение заявок текущего пользователя' })
  async getMy(@DecodeUser() user: User) {
    return this.service.getMy(user);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ENGINEER)
  @ApiOperation({ summary: 'Получение статистики по заявкам' })
  async getStats(@DecodeUser() user: User) {
    return this.service.getStats(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение заявки по идентификатору' })
  async getById(@DecodeUser() user: User, @Param('id') id: string) {
    return this.service.getById(id, user);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ENGINEER)
  @ApiOperation({ summary: 'Обновление заявки' })
  @ApiBody({ type: UpdateServiceRequestDto })
  async update(
    @DecodeUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
  ) {
    return this.service.update(id, dto, user);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ENGINEER)
  @ApiOperation({ summary: 'Изменение статуса заявки' })
  @ApiBody({ type: UpdateServiceRequestStatusDto })
  async updateStatus(
    @DecodeUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestStatusDto,
  ) {
    return this.service.updateStatus(id, dto, user);
  }

  @Post(':id/assign')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Назначение заявки инженеру' })
  @ApiBody({ type: AssignServiceRequestDto })
  async assign(@Param('id') id: string, @Body() dto: AssignServiceRequestDto) {
    return this.service.assign(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(204)
  @ApiOperation({ summary: 'Удаление заявки (только администратор)' })
  async delete(@DecodeUser() user: User, @Param('id') id: string) {
    await this.service.delete(id, user);
  }
}
