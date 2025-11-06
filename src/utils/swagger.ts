import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerInit = async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Med App')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.use('/docs', (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth || typeof auth !== 'string') {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API"');
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }

    const [type, credentials] = auth.split(' ');

    if (type !== 'Basic') {
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }

    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');

    const validUsername = configService.get('SWAGGER_USER');
    const validPassword = configService.get('SWAGGER_PASSWORD');

    if (username !== validUsername || password !== validPassword) {
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }
    next();
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
      preloadModels: false,
      tryItOutEnabled: true,
      syntaxHighlight: true,
    },
    customSiteTitle: 'Med App',
    customCss: '.swagger-ui .topbar { display: none }',
  });
};
