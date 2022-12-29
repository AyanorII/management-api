import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductCreateInput, ProductUncheckedCreateInput, XOR } from 'prisma';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { VendorProductsService } from '../vendors/vendor-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorProductsService: VendorProductsService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const data = await this.buildCreateProductData(createProductDto);

    const product = await this.prisma.product.create({
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        vendorProduct: true,
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
        // vendors: true,
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
    const { name } = updateProductDto;
    if (name) {
      Object.assign(updateProductDto).slug = slugify(name, { lower: true });
    }

    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
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

  async buildCreateProductData(createProductDto: CreateProductDto) {
    const { categoryId, vendorProductId, ...rest } = createProductDto;

    let cost: number = createProductDto.cost || 0;

    // If a vendor product is selected, use its price as the product's cost
    if (!cost && vendorProductId) {
      const vendorProduct = await this.vendorProductsService.findOne(
        vendorProductId,
      );
      console.log(createProductDto);
      console.log(vendorProduct);
      cost = vendorProduct.price;
    }

    const data: XOR<ProductCreateInput, ProductUncheckedCreateInput> = {
      ...rest,
      cost,
      slug: slugify(createProductDto.name, {
        lower: true,
      }),
      category: {
        connect: {
          id: categoryId,
        },
      },
    };

    // If a vendor product is selected, connect it to the product
    if (vendorProductId) {
      data.vendorProduct = {
        connect: {
          id: vendorProductId,
        },
      };
    }

    return data;
  }
}
