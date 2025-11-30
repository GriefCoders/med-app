import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { TokenModule } from 'src/modules/token/token.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule,
    UserModule,
    TokenModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
