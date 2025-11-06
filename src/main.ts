import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import { swaggerInit } from './utils/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      validateCustomDecorators: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });
  await swaggerInit(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
