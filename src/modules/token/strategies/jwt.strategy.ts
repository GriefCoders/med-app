import { JwtPayload } from 'src/types/jwt-payload';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      return this.userService.findOneById(payload.id);
    } catch (error) {
      throw new UnauthorizedException('Не авторизован');
    }
  }
}
