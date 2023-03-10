import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config service
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.use(helmet());

  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
  });

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Management API')
    .setVersion('1.0')
    .addTag('Management')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Globals
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  await app.listen(port);
}
bootstrap();
