import { forwardRef, Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { PrismaService } from '../prisma/prisma.service';
import { VendorProductsService } from './vendor-products.service';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  controllers: [VendorsController],
  providers: [VendorsService, VendorProductsService, PrismaService],
  exports: [VendorsService, VendorProductsService],
})
export class VendorsModule {}
