import { Injectable, NotFoundException } from '@nestjs/common';
import { User, VendorProduct } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorProductDto } from './dto/create-vendor-product.dto';
import { UpdateVendorProductDto } from './dto/update-vendor-product.dto';

@Injectable()
export class VendorProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    vendorId: number,
    createVendorProductDto: CreateVendorProductDto,
    user: User,
  ): Promise<VendorProduct> {
    const vendorProduct = await this.prisma.vendorProduct.create({
      data: {
        ...createVendorProductDto,
        vendor: {
          connect: {
            id: vendorId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        vendor: true,
      },
    });
    return vendorProduct;
  }

  async findOne(id: number, user: User): Promise<VendorProduct> {
    const vendorProduct = await this.prisma.vendorProduct.findFirst({
      where: {
        id,
        userId: user.id,
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
    user: User,
  ): Promise<VendorProduct> {
    const [_count, vendorProduct] = await this.prisma.$transaction([
      this.prisma.vendorProduct.updateMany({
        where: {
          id: vendorProductId,
          userId: user.id,
        },
        data: updateVendorProductDto,
      }),
      this.prisma.vendorProduct.findFirst({
        where: {
          id: vendorProductId,
          userId: user.id,
        },
      }),
    ]);

    return vendorProduct;
  }
}
