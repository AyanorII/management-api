import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from '../config.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configValidationSchema,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
