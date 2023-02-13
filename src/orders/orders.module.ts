import { forwardRef, Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { OrderItemsModule } from '../order-items/order-items.module';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from './orders.service';

@Module({
  imports: [MailModule, forwardRef(() => OrderItemsModule)],
  providers: [OrdersService, PrismaService],
  exports: [OrdersService],
})
export class OrdersModule {}
