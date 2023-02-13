import { MailerService, MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { VendorProductsService } from './vendor-products.service';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { MailerOptions } from '../mail/mailer.provider';
import { OrderItemsService } from '../order-items/order-items.service';

describe('VendorsController', () => {
  let controller: VendorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [MailerModule.forRootAsync(MailerOptions)],
      controllers: [VendorsController],
      providers: [
        PrismaService,
        VendorsService,
        VendorProductsService,
        OrdersService,
        OrderItemsService,
        ConfigService,
        MailerOptions,
        MailService,
        MailerService,
      ],
    }).compile();

    controller = module.get<VendorsController>(VendorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
