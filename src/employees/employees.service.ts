import { Injectable, NotFoundException } from '@nestjs/common';
import { Employee, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    user: User,
  ): Promise<Employee> {
    const startedAt = new Date(createEmployeeDto.startedAt);

    const employee = await this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        startedAt,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return employee;
  }

  async findAll(user: User): Promise<Employee[]> {
    const employees = await this.prisma.employee.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        active: 'desc',
      },
    });
    return employees;
  }

  async findOne(id: number, user: User): Promise<Employee> {
    const employee = await this.prisma.employee.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee #${id} not found`);
    }

    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
    user: User,
  ): Promise<Employee> {
    const [_count, employee] = await this.prisma.$transaction([
      this.prisma.employee.updateMany({
        where: {
          id,
          userId: user.id,
        },
        data: updateEmployeeDto,
      }),
      this.prisma.employee.findFirst({
        where: {
          id,
          userId: user.id,
        },
      }),
    ]);

    return employee;
  }

  async remove(id: number, user: User): Promise<void> {
    const { count } = await this.prisma.employee.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    if (count === 0) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
  }
}
