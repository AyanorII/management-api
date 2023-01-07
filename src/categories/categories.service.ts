import { Injectable, NotFoundException } from '@nestjs/common';
import { Category, User } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    user: User,
  ): Promise<Category> {
    const { name } = createCategoryDto;

    const slug = slugify(name, { lower: true });
    const category = await this.prisma.category.create({
      data: {
        name,
        slug,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return category;
  }

  async findAll(user: User): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async findOne(id: number, user: User): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: { id, userId: user.id },
      include: {
        products: true,
        _count: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id: '${id}' not found`);
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    user: User,
  ): Promise<Category> {
    const slug = slugify(updateCategoryDto.name);

    const [_count, category] = await this.prisma.$transaction([
      this.prisma.category.updateMany({
        where: { id, userId: user.id },
        data: { ...updateCategoryDto, slug },
      }),
      this.prisma.category.findFirst({
        where: {
          id,
          userId: user.id,
        },
      }),
    ]);

    return category;
  }

  async remove(id: number, user: User): Promise<void> {
    const { count } = await this.prisma.category.deleteMany({
      where: { id, userId: user.id },
    });

    if (count === 0) {
      throw new NotFoundException(`Category with id: '${id}' not found`);
    }
  }
}
