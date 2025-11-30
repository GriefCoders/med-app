import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import { swaggerInit } from './utils/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: Request, res: Response, next: NextFunction) => {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      Logger.log(
        `${method} ${originalUrl} ${statusCode} - ${duration}ms`,
        'HTTP',
      );
    });

    next();
  });

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
