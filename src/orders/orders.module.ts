import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { PrismaService } from '../prisma/prisma.service';
import { OrderItemsService } from './order-items.service';
import { OrdersService } from './orders.service';

@Module({
  imports: [MailModule],
  providers: [OrdersService, OrderItemsService, PrismaService],
  exports: [OrdersService, OrderItemsService],
})
export class OrdersModule {}
