import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VendorProductsService } from '../vendors/vendor-products.service';
import { VendorsModule } from '../vendors/vendors.module';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';

@Module({
  imports: [forwardRef(() => VendorsModule)],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, VendorProductsService, PrismaService],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
