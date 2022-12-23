import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto;

    const slug = slugify(name);
    const category = await this.prisma.category.create({
      data: { name, slug },
    });

    return category;
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id: '${id}' not found`);
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const slug = slugify(updateCategoryDto.name);
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto, slug },
    });

    return updatedCategory;
  }

  async remove(id: number): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
