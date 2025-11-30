import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Сервис')
@Controller()
export class AppController {
  @Get('healthz')
  @ApiOperation({ summary: 'Проверка доступности сервиса' })
  async healthz() {
    return { status: 'ok' };
  }
}
