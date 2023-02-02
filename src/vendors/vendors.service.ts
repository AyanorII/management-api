import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Vendor } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVendorDto: CreateVendorDto, user: User): Promise<Vendor> {
    const vendor = await this.prisma.vendor.create({
      data: {
        ...createVendorDto,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return vendor;
  }

  async findAll(user: User): Promise<Vendor[]> {
    const { id } = user;

    const vendors = await this.prisma.vendor.findMany({
      where: {
        user: {
          id,
        },
      },
    });
    return vendors;
  }

  async findOne(id: number, user: User): Promise<Vendor> {
    const vendor = await this.prisma.vendor.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        vendorProducts: true,
        _count: true,
      },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor #${id} not found`);
    }

    return vendor;
  }

  async update(
    id: number,
    updateVendorDto: UpdateVendorDto,
    user: User,
  ): Promise<Vendor> {
    const [_count, vendor] = await this.prisma.$transaction([
      this.prisma.vendor.updateMany({
        where: {
          id,
          userId: user.id,
        },
        data: updateVendorDto,
      }),
      this.prisma.vendor.findFirst({
        where: {
          id,
          userId: user.id,
        },
      }),
    ]);

    if (vendor) {
      return vendor;
    }

    throw new NotFoundException(`Vendor #${id} not found`);
  }

  async remove(id: number, user: User): Promise<void> {
    const { count } = await this.prisma.vendor.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    if (count === 0) {
      throw new NotFoundException(`Vendor #${id} not found`);
    }
  }
}
