import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductCreateInput, ProductUncheckedCreateInput, XOR } from 'prisma';
import slugify from 'slugify';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { VendorProductsService } from '../vendors/vendor-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorProductsService: VendorProductsService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[],
  ) {
    const product = await this.createProduct(createProductDto);

    if (files) {
      const productWithImages = await this.attachProductImages(product, files);
      return productWithImages;
    }

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
        productImages: {
          select: {
            url: true,
          },
        },
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

    // If no cost is provided, and vendor product is given, use its price as the product's cost
    if (!cost && vendorProductId) {
      const vendorProduct = await this.vendorProductsService.findOne(
        vendorProductId,
      );
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

    // If a vendor product is given, connect it to the product
    if (vendorProductId) {
      data.vendorProduct = {
        connect: {
          id: vendorProductId,
        },
      };
    }

    return data;
  }

  async createProduct(CreateProductDto) {
    const data = await this.buildCreateProductData(CreateProductDto);

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
        productImages: {
          select: {
            url: true,
          },
        },
      },
    });

    return product;
  }

  /**
   * Uploads images to Cloudinary and creates ProductImages connecting with the product
   * @param product
   * @param files
   * @returns Product with images attached
   */
  async attachProductImages(product: Product, files: Express.Multer.File[]) {
    const uploadImagesPromises = files.map((file) => this.uploadImage(file));
    const images = await Promise.all(uploadImagesPromises);
    const urls = images.map((url) => ({ url }));

    return this.prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        productImages: {
          createMany: {
            data: urls,
          },
        },
      },
      include: {
        vendorProduct: true,
        productImages: {
          select: {
            url: true,
          },
        },
      },
    });
  }

  /**
   * Uploads the file (image) to Cloudinary and returns the URLof the image
   * @param file
   * @returns The URL of the uploaded image
   */
  async uploadImage(file: Express.Multer.File) {
    const { secure_url } = await this.cloudinary.uploadImage(file);
    return secure_url;
  }

  async deleteImage(url: string) {
    return this.cloudinary.deleteImage(url);
  }
}
