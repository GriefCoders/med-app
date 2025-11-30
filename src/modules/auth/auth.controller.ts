import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signup.dto';
import { RefreshDto } from './dto/refresh.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Вход пользователя по email и паролю' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    description: 'Пара токенов доступа и обновления',
  })
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токена доступа по refresh-токену' })
  @ApiBody({ type: RefreshDto })
  @ApiOkResponse({
    description: 'Новая пара токенов доступа и обновления',
  })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }
}
