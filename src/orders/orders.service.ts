import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItemsService } from './order-items.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderItems, vendorId, ...data } = createOrderDto;

    const items = await this.orderItemsService.buildMany(orderItems);
    const total = items.reduce((acc, item) => acc + item.subtotal, 0);

    const order = await this.prisma.order.create({
      data: {
        ...data,
        total,
        orderItems: {
          createMany: {
            data: items,
          },
        },
        vendor: {
          connect: {
            id: vendorId,
          },
        },
      },
      include: {
        vendor: true,
        orderItems: true,
      },
    });
    return order;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
