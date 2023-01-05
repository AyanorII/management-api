import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { IOrderItem } from './interfaces/index';

@Injectable()
export class OrderItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async build(createOrderItemDto: CreateOrderItemDto): Promise<IOrderItem> {
    const { vendorProductId } = createOrderItemDto;

    const vendorProduct = await this.prisma.vendorProduct.findUnique({
      where: {
        id: vendorProductId,
      },
    });

    const cost = vendorProduct.price;

    return {
      ...createOrderItemDto,
      cost,
      subtotal: cost * createOrderItemDto.quantity,
    };
  }

  async buildMany(
    createOrderItemDto: CreateOrderItemDto[],
  ): Promise<IOrderItem[]> {
    const itemsPromise = createOrderItemDto.map((item) => this.build(item));
    const items = await Promise.all(itemsPromise);
    return items;
  }
}
