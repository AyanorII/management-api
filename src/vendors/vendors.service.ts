import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorDocument } from './schemas/vendor.schema';
import { VendorsRepository } from './vendors.repository';

@Injectable()
export class VendorsService {
  constructor(
    // private readonly prisma: PrismaService,
    private readonly vendorsRepository: VendorsRepository,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<VendorDocument> {
    try {
      const vendor = await this.vendorsRepository.create(createVendorDto);
      return vendor;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async findAll(
    filterQuery: FilterQuery<VendorDocument>,
    // TODO: add pagination params
  ): Promise<VendorDocument[]> {
    const vendors = await this.vendorsRepository.findAll(filterQuery);

    return vendors;
  }

  async findOne(
    filterQuery: FilterQuery<VendorDocument>,
  ): Promise<VendorDocument> {
    const vendor = await this.vendorsRepository.findOne(filterQuery);

    if (!vendor) {
      throw new NotFoundException(`Vendor not found`);
    }

    return vendor;
  }
  // async findOne(id: number, user: User): Promise<Vendor> {
  //   const vendor = await this.prisma.vendor.findFirst({
  //     where: {
  //       id,
  //       userId: user.id,
  //     },
  //     include: {
  //       vendorProducts: true,
  //       _count: true,
  //     },
  //   });

  //   if (!vendor) {
  //     throw new NotFoundException(`Vendor #${id} not found`);
  //   }

  //   return vendor;
  // }

  // async update(
  //   id: number,
  //   updateVendorDto: UpdateVendorDto,
  //   user: User,
  // ): Promise<Vendor> {
  //   const [_count, vendor] = await this.prisma.$transaction([
  //     this.prisma.vendor.updateMany({
  //       where: {
  //         id,
  //         userId: user.id,
  //       },
  //       data: updateVendorDto,
  //     }),
  //     this.prisma.vendor.findFirst({
  //       where: {
  //         id,
  //         userId: user.id,
  //       },
  //     }),
  //   ]);

  //   if (vendor) {
  //     return vendor;
  //   }

  //   throw new NotFoundException(`Vendor #${id} not found`);
  // }

  // async remove(id: number, user: User): Promise<void> {
  //   const { count } = await this.prisma.vendor.deleteMany({
  //     where: {
  //       id,
  //       userId: user.id,
  //     },
  //   });

  //   if (count === 0) {
  //     throw new NotFoundException(`Vendor #${id} not found`);
  //   }
  // }
}
// Create folder
// Create file inside the folder
// add page.content to the created file
