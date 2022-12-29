import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorProductDto } from './dto/create-vendor-product.dto';

@Injectable()
export class VendorProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    vendorId: number,
    createVendorProductDto: CreateVendorProductDto,
  ) {
    const vendorProduct = await this.prisma.vendorProduct.create({
      data: {
        ...createVendorProductDto,
        vendorId,
      },
      include: {
        vendor: true,
      },
    });
    return vendorProduct;
  }

  async findOne(id: number) {
    const vendorProduct = await this.prisma.vendorProduct.findUnique({
      where: {
        id,
      },
    });

    if (!vendorProduct) {
      throw new NotFoundException(`Vendor product with id: '${id}' not found`);
    }

    return vendorProduct;
  }
}
