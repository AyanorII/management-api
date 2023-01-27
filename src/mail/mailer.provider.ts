import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const MailerOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  provide: 'MAILER_OPTIONS',
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
};

export const mockMailerOptions = {
  name: 'MAILER_OPTIONS',
  provide: 'MAILER_OPTIONS',
  useValue: {
    transport: {
      service: 'MAILER_SERVICE',
      auth: {
        user: 'MAILER_USER',
        pass: 'MAILER_PASS',
      },
    },
  },
};
