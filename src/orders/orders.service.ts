import { Injectable } from '@nestjs/common';
import { Order, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemsService } from './order-items.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { orderItems, vendorId, ...data } = createOrderDto;

    const { items, total } = await this.orderItemsService.buildMany(
      orderItems,
      user,
    );

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
        user: {
          connect: {
            id: user.id,
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

  async findAll(user: User): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId: user.id,
      },
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

  async findOne(id: number, user: User): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        userId: user.id,
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

  async remove(id: number, user: User): Promise<void> {
    await this.prisma.order.deleteMany({
      where: { id, userId: user.id },
    });
  }
}
