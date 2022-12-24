import { Injectable, NotFoundException } from '@nestjs/common';
import { Vendor } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../products/entities/product.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendor = await this.prisma.vendor.create({
      data: createVendorDto,
    });
    return vendor;
  }

  async findAll(): Promise<Vendor[]> {
    const vendors = await this.prisma.vendor.findMany();
    return vendors;
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
        _count: true,
      },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor #${id} not found`);
    }

    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.prisma.vendor.update({
      where: {
        id,
      },
      data: updateVendorDto,
    });

    return vendor;
  }

  async remove(id: number): Promise<void> {
    await this.prisma.vendor.delete({
      where: {
        id,
      },
    });
  }

  async vendorProducts(id: number): Promise<Product[]> {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
        _count: true,
      },
    });

    return vendor.products;
  }
}