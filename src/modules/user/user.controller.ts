import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { DecodeUser } from 'src/decorators/decode-user.decorator';
import type { User } from 'src/types/user';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@DecodeUser() user: User & { password: string | undefined }) {
    return {
      ...user,
      password: undefined,
    };
  }
}
