import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
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

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });
    return orders;
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        vendor: true,
        orderItems: true,
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    return order;
  }

  async remove(id: number): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    });
  }
}
