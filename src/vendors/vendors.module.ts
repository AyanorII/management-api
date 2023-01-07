import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrdersModule } from '../orders/orders.module';
import { PrismaService } from '../prisma/prisma.service';
import { VendorProductsService } from './vendor-products.service';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';

@Module({
  imports: [AuthModule, OrdersModule],
  controllers: [VendorsController],
  providers: [VendorsService, VendorProductsService, PrismaService],
  exports: [VendorsService, VendorProductsService],
})
export class VendorsModule {}
