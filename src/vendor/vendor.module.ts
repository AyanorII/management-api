import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';

@Module({
  imports: [AuthModule],
  controllers: [VendorController],
  providers: [VendorService, PrismaService],
})
export class VendorModule {}
