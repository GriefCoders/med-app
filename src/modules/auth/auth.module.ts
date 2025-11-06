import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordModule } from '../password/password.module';
import { UserModule } from '../user/user.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [UserModule, TokenModule, PasswordModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
