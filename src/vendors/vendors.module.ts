import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { VendorsController } from './vendor.controller';
import { VendorsService } from './vendors.service';

@Module({
  imports: [AuthModule],
  controllers: [VendorsController],
  providers: [VendorsService, PrismaService],
})
export class VendorModule {}
