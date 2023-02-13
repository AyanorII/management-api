import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { VendorProductsService } from '../vendors/vendor-products.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(private readonly vendorProductsService: VendorProductsService) {}

  async build(
    createOrderItemDto: CreateOrderItemDto,
    user: User,
  ): Promise<Prisma.OrderItemCreateManyOrderInput> {
    const { vendorProductId } = createOrderItemDto;

    const vendorProduct = await this.vendorProductsService.findOne(
      vendorProductId,
      user,
    );

    const cost = vendorProduct.price;

    return {
      ...createOrderItemDto,
      cost,
      subtotal: cost * createOrderItemDto.quantity,
      userId: user.id,
    };
  }

  async buildMany(
    createOrderItemDto: CreateOrderItemDto[],
    user: User,
  ): Promise<{
    items: Prisma.OrderItemCreateManyOrderInput[];
    total: number;
  }> {
    const itemsPromise = createOrderItemDto.map((item) =>
      this.build(item, user),
    );

    const items = await Promise.all(itemsPromise);
    const total = items.reduce((acc, item) => acc + item.subtotal, 0);
    console.log(items);
    console.log({ items, total });
    return { items, total };
  }
}
