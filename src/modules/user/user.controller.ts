import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { DecodeUser } from 'src/decorators/decode-user.decorator';
import type { User } from 'src/types/user';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Пользователи')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async getMe(@DecodeUser() user: User & { password: string | undefined }) {
    return {
      ...user,
      password: undefined,
    };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Создание пользователя (только администратор)' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get('search')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Поиск пользователей (только администратор)' })
  @ApiQuery({
    name: 'query',
    required: false,
    description:
      'Строка поиска. Ищет по ФИО, email и номеру комнаты. Если не указана — вернёт всех пользователей.',
  })
  async search(@Query('query') query = '') {
    return this.userService.search(query);
  }
}
