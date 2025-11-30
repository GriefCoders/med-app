import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { SiteRepository } from './site.repository';

@Module({
  providers: [SiteService, SiteRepository],
  controllers: [SiteController],
  exports: [SiteService],
})
export class SiteModule {}
