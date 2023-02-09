import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User, Vendor } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorsService } from './vendors.service';

describe('VendorsService', () => {
  let vendorsService: VendorsService;
  let prisma: PrismaService;
  let user1: User;
  let user2: User;
  let user1Vendor: Vendor;
  let user2Vendor: Vendor;

  const createVendorDto: CreateVendorDto = {
    name: 'Test Vendor',
    contact: 'Test Vendor Contact',
    email: 'vendor@email.com',
    phone: '1234567890',
    website: 'https://vendor.com',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorsService, PrismaService],
    }).compile();

    vendorsService = module.get<VendorsService>(VendorsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    user1 = await prisma.user.create({
      data: {
        email: 'johndoe@email.com',
        password: 'password',
        name: 'John Doe',
        companyName: 'John Doe Company',
      },
    });

    user2 = await prisma.user.create({
      data: {
        email: 'anotheruser@email.com',
        password: 'password',
        name: 'Another User',
        companyName: 'Another User Company',
      },
    });

    user1Vendor = await prisma.vendor.create({
      data: {
        ...createVendorDto,
        userId: user1.id,
      },
    });
    user2Vendor = await prisma.vendor.create({
      data: {
        ...createVendorDto,
        userId: user2.id,
      },
    });
  });

  afterEach(async () => {
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(vendorsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a vendor', async () => {
      expect(user1Vendor).toHaveProperty('id');
    });
  });

  describe('findAll', () => {
    it('should return only vendors of the specific user', async () => {
      const [allVendorsCount, userVendorCount] = await Promise.all([
        prisma.vendor.count(),
        prisma.vendor.count({
          where: {
            userId: user1.id,
          },
        }),
      ]);

      expect(allVendorsCount).toBeGreaterThan(userVendorCount);
    });
  });

  describe('findOne', () => {
    it('should return one vendor of the specific user', async () => {
      user1Vendor = await vendorsService.findOne(user1Vendor.id, user1);

      expect(user1Vendor).toHaveProperty('id');
      expect(user1Vendor).toHaveProperty('name', createVendorDto.name);
      expect(user1Vendor).toHaveProperty('vendorProducts');
      expect(user1Vendor).toHaveProperty('_count');
    });

    it('should throw a NotFoundException if user not found', async () => {
      await expect(vendorsService.findOne(-1, user1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("should not be able to return other user's vendor", async () => {
      await expect(
        vendorsService.findOne(user2Vendor.id, user1),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    const updatedName = 'Updated Vendor';

    it('should update a vendor', async () => {
      const updatedVendor = await vendorsService.update(
        user1Vendor.id,
        {
          name: updatedName,
        },
        user1,
      );

      expect(updatedVendor).toHaveProperty('id', user1Vendor.id);
      expect(updatedVendor).toHaveProperty('name', updatedName);
    });

    it('should throw a NotFoundException if vendor not found', async () => {
      await expect(
        vendorsService.update(-1, { name: updatedName }, user1),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("should not be able to update other user's vendor", async () => {
      await expect(
        vendorsService.update(
          user2Vendor.id,
          { name: 'Updated Vendor' },
          user1,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a vendor', async () => {
      await vendorsService.remove(user1Vendor.id, user1);

      const vendor = await prisma.vendor.findUnique({
        where: {
          id: user1Vendor.id,
        },
      });

      expect(vendor).toBe(null);
    });

    it('should throw a NotFoundException if user not found', async () => {
      await expect(vendorsService.remove(-1, user1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("should not be able to remove other user's vendor", async () => {
      await expect(
        vendorsService.remove(user2Vendor.id, user1),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
