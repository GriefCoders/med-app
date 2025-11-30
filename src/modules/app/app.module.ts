import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { TokenModule } from 'src/modules/token/token.module';
import { AuthModule } from '../auth/auth.module';
import { SiteModule } from '../site/site.module';
import { EquipmentModule } from '../equipment/equipment.module';
import { ServiceRequestModule } from '../service-request/service-request.module';

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
    SiteModule,
    EquipmentModule,
    ServiceRequestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
