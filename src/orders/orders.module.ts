import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderItemsService } from './order-items.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderItemsService, PrismaService],
})
export class OrdersModule {}
