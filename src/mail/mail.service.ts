import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

type SendMailOptions = {
  to: string;
  from: { name: string; email: string };
  subject: string;
  template?: string;
  context?: {
    [key: string]: any;
  };
};

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail({ to, subject, template, context, from }: SendMailOptions) {
    try {
      await this.mailerService.sendMail({
        to,
        from: `${from.name} <${from.email}>`,
        subject,
        template: template || './test',
        context,
        cc: from.email,
        replyTo: from.email,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
