import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, vendors, ...data } = createProductDto;

    const product = await this.prisma.product.create({
      data: {
        ...data,
        slug: slugify(createProductDto.name, {
          lower: true,
        }),
        category: {
          connect: {
            id: categoryId,
          },
        },
        vendors: {
          connect: vendors.map((id) => ({ id })),
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        vendors: true,
      },
    });
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        vendors: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id: '${id}' not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { vendors, ...rest } = updateProductDto;
    const data = { ...rest };

    const { name } = updateProductDto;
    if (name) {
      Object.assign(data).slug = slugify(name, { lower: true });
    }

    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...data,
        vendors: {
          connect: vendors.map((id) => ({ id })),
        },
      },
    });
    return product;
  }

  async remove(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
