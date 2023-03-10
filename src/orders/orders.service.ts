import { Injectable } from '@nestjs/common';
import { Order, User } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemsService } from '../order-items/order-items.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderItemsService: OrderItemsService,
    private readonly mailService: MailService,
  ) {}

  async create(
    vendorId,
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<Order> {
    const { orderItems, ...data } = createOrderDto;

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

    if (order.vendor.email) {
      await this.mailService.sendMail({
        from: {
          name: user.companyName,
          email: user.email,
        },
        to: order.vendor.email,
        subject: 'New Order',
        template: 'order',
        context: {
          order,
          user,
        },
      });
    }

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
    const { count } = await this.prisma.order.deleteMany({
      where: { id, userId: user.id },
    });

    if (count === 0) {
      throw new Error(`Order with id: '${id}' not found`);
    }
  }
}
