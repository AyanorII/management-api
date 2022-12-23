import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config service
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Management API')
    .setVersion('1.0')
    .addTag('Management')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Pipes
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
