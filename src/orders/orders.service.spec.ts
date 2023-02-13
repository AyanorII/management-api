import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { PrismaService } from '../prisma/prisma.service';
import { VendorsModule } from '../vendors/vendors.module';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule, forwardRef(() => VendorsModule)],
      providers: [OrdersService, PrismaService, OrderItemsService, MailService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
