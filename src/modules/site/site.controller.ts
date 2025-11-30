import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SiteService } from './site.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Отделения')
@Controller('site')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('search')
  @ApiOperation({ summary: 'Поиск отделений по названию, адресу или коду' })
  @ApiQuery({
    name: 'query',
    required: false,
    description:
      'Строка поиска. Ищет по названию, адресу и коду отделения. Если не указана — вернёт все отделения.',
  })
  async search(@Query('query') query = '') {
    return this.siteService.search(query);
  }
}
