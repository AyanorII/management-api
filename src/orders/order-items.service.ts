import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async build(
    vendorId: number,
    createOrderItemDto: CreateOrderItemDto,
    user: User,
  ): Promise<Prisma.OrderItemCreateManyOrderInput> {
    const { vendorProductId } = createOrderItemDto;

    const vendorProduct = await this.prisma.vendorProduct.findFirst({
      where: {
        id: vendorProductId,
        vendorId,
      },
    });

    if (!vendorProduct) {
      throw new NotFoundException(
        `Vendor product with ID: '${vendorProductId}' not found for vendor with ID: '${vendorId}'`,
      );
    }

    const cost = vendorProduct.price;

    return {
      ...createOrderItemDto,
      cost,
      subtotal: cost * createOrderItemDto.quantity,
      userId: user.id,
    };
  }

  async buildMany(
    vendorId,
    createOrderItemDto: CreateOrderItemDto[],
    user: User,
  ): Promise<{
    items: Prisma.OrderItemCreateManyOrderInput[];
    total: number;
  }> {
    const itemsPromise = createOrderItemDto.map((item) =>
      this.build(vendorId, item, user),
    );
    const items = await Promise.all(itemsPromise);
    const total = items.reduce((acc, item) => acc + item.subtotal, 0);
    return { items, total };
  }
}
