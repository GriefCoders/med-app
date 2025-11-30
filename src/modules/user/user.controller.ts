import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { DecodeUser } from 'src/decorators/decode-user.decorator';
import type { User } from 'src/types/user';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';

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
}
