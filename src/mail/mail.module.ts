import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerOptions, mockMailerOptions } from './mailer.provider';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: configService.get('MAILER_SERVICE') || 'MAILER_SERVICE',
          auth: {
            user: configService.get('MAILER_USER'),
            pass: configService.get('MAILER_PASS'),
          },
        },
        template: {
          dir: 'dist/mail/templates',
          adapter: new HandlebarsAdapter(),
        },
      }),
    }),
  ],
  providers: [MailService, MailerOptions, mockMailerOptions],
  exports: [MailService, MailerOptions, mockMailerOptions],
})
export class MailModule {}
