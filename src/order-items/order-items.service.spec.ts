import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, User, VendorProduct } from '@prisma/client';
import { MailModule } from '../mail/mail.module';
import { CreateOrderItemDto } from '../order-items/dto/create-order-item.dto';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { VendorProductsService } from '../vendors/vendor-products.service';
import { VendorsModule } from '../vendors/vendors.module';
import { OrderItemsService } from './order-items.service';

describe('OrderItemsService', () => {
  let orderItemsService: OrderItemsService;
  let vendorProductsService: VendorProductsService;
  let prisma: PrismaService;
  let user: User;
  let orderItemObject: Prisma.OrderItemCreateManyOrderInput;
  let orderItemObject2: Prisma.OrderItemCreateManyOrderInput;

  const vendorProductMock: VendorProduct = {
    id: 1,
    price: 100,
    vendorId: 1,
    name: 'Product 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
  };

  const vendorProductMock2: VendorProduct = {
    id: 2,
    price: 250,
    vendorId: 1,
    name: 'Product 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
  };

  const vendorProductsMockMap = {
    1: vendorProductMock,
    2: vendorProductMock2,
  };

  const createOrderItemDto: CreateOrderItemDto = {
    quantity: 3,
    vendorProductId: 1,
  };

  const createOrderItemDto2: CreateOrderItemDto = {
    quantity: 5,
    vendorProductId: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule, VendorsModule],
      providers: [OrdersService, PrismaService, OrderItemsService],
    })
      .useMocker(createMock)
      .compile();

    orderItemsService = module.get<OrderItemsService>(OrderItemsService);
    vendorProductsService = module.get<VendorProductsService>(
      VendorProductsService,
    );
    prisma = module.get<PrismaService>(PrismaService);

    jest
      .spyOn(vendorProductsService, 'findOne')
      .mockImplementation((id) => vendorProductsMockMap[id]);

    user = await prisma.user.create({
      data: {
        email: 'john@doe.com',
        password: 'password',
        name: 'John Doe',
        companyName: 'John Doe Company',
      },
    });

    orderItemObject = {
      ...createOrderItemDto,
      cost: vendorProductMock.price,
      subtotal: vendorProductMock.price * createOrderItemDto.quantity,
      userId: user.id,
    };

    orderItemObject2 = {
      ...createOrderItemDto2,
      cost: vendorProductMock2.price,
      subtotal: vendorProductMock2.price * createOrderItemDto2.quantity,
      userId: user.id,
    };
  });

  afterEach(async () => {
    await prisma.cleanDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(orderItemsService).toBeDefined();
  });

  describe('Build', () => {
    it('should return a new order item object', async () => {
      const orderItemObject: Prisma.OrderItemCreateManyOrderInput = {
        ...createOrderItemDto,
        cost: vendorProductMock.price,
        subtotal: vendorProductMock.price * createOrderItemDto.quantity,
        userId: user.id,
      };

      await expect(
        orderItemsService.build(createOrderItemDto, user),
      ).resolves.toEqual(orderItemObject);

      expect(vendorProductsService.findOne).toHaveBeenCalled();
    });
  });

  describe('BuildMany', () => {
    it('should return an array of order item objects', async () => {
      const total = orderItemObject.subtotal + orderItemObject2.subtotal;
      const createManyOrderItemsDto = [createOrderItemDto, createOrderItemDto2];

      const orderItemsObject: {
        items: Prisma.OrderItemCreateManyOrderInput[];
        total: number;
      } = await orderItemsService.buildMany(createManyOrderItemsDto, user);

      expect(orderItemsObject.items).toHaveLength(
        createManyOrderItemsDto.length,
      );

      expect(orderItemsObject.total).toBe(total);
    });
  });
});
