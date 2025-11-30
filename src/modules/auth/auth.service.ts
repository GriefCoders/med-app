import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { TokenService } from 'src/modules/token/token.service';
import { PasswordService } from '../password/password.service';
import { SignInDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  private async generateTokenPair(userId: string) {
    const accessTokenData = await this.tokenService.generateAccessToken(userId);
    const refreshTokenData = await this.tokenService.generateRefreshToken(
      userId,
      accessTokenData.jti,
    );

    return {
      accessToken: accessTokenData.token,
      refreshToken: refreshTokenData.token,
      jti: accessTokenData.jti,
    };
  }

  async signIn(dto: SignInDto) {
    const user = await this.userService.findOneByEmail(dto.email);

    if (
      !(await this.passwordService.comparePassword({
        password: dto.password,
        hashedPassword: user.password,
      }))
    ) {
      this.logger.warn(`Неудачная попытка входа для ${dto.email}`);
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const tokens = await this.generateTokenPair(user.id);

    this.logger.log(`Пользователь ${dto.email} успешно вошел в систему`);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Неверный токен обновления');
    }

    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    const tokens = await this.generateTokenPair(payload.id);

    this.logger.log(`Обновлен токен для пользователя ${payload.id}`);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
