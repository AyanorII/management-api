import { Injectable, NotFoundException } from '@nestjs/common';
import { VendorProduct } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorProductDto } from './dto/create-vendor-product.dto';
import { UpdateVendorProductDto } from './dto/update-vendor-product.dto';

@Injectable()
export class VendorProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    vendorId: number,
    createVendorProductDto: CreateVendorProductDto,
  ): Promise<VendorProduct> {
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

  async findOne(id: number): Promise<VendorProduct> {
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

  async update(
    vendorProductId: number,
    updateVendorProductDto: UpdateVendorProductDto,
  ): Promise<VendorProduct> {
    const vendorProduct = await this.prisma.vendorProduct.update({
      where: {
        id: vendorProductId,
      },
      data: updateVendorProductDto,
    });
    return vendorProduct;
  }
}
