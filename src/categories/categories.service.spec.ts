import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category, User } from '@prisma/client';
import { PrismaClientExceptionFilter } from '../prisma/prisma-client-exception.filter';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let prisma: PrismaService;
  let user: User;
  let category: Category;
  const categoryName = 'Category name';
  const categorySlug = 'category-name';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        PrismaService,
        PrismaClientExceptionFilter,
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
    user = await prisma.user.create({
      data: {
        email: 'john@doe.com',
        password: 'password',
        companyName: 'John Doe',
        name: 'John Doe',
      },
    });

    category = await categoriesService.create({ name: categoryName }, user);
  });

  afterAll(async () => {
    await prisma.cleanDatabase();
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('slug', categorySlug);
      expect(category).toHaveProperty('name', categoryName);
    });

    it('should not create a category if user has already created one with the same name', async () => {
      await expect(
        categoriesService.create({ name: categoryName }, user),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('find', () => {
    it("should find a user's category", async () => {
      const foundCategory = await categoriesService.findOne(category.id, user);

      expect(foundCategory).toHaveProperty('name', categoryName);
      expect(foundCategory).toHaveProperty('slug', categorySlug);
    });

    it("should be able to find all user's categories", async () => {
      await expect(categoriesService.findAll(user)).resolves.toEqual(
        expect.arrayContaining([expect.objectContaining(category)]),
      );
    });

    it("should not be able to see other user's category", async () => {
      const otherUser = await prisma.user.create({
        data: {
          email: 'otheruser@email.com',
          password: 'password',
          companyName: 'Other User',
          name: 'Other User',
        },
      });

      await expect(
        categoriesService.findOne(category.id, otherUser),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw a NotFoundException if category was not found', async () => {
      expect(categoriesService.findOne(-1, user)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
