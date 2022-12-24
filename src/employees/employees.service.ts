import { Injectable, NotFoundException } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const startedAt = new Date(createEmployeeDto.startedAt);

    const employee = await this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        startedAt,
      },
    });

    return employee;
  }

  async findAll(): Promise<Employee[]> {
    const employees = await this.prisma.employee.findMany({
      orderBy: {
        active: 'desc',
      },
    });
    return employees;
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id,
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
  ): Promise<Employee> {
    const employee = await this.prisma.employee.update({
      where: {
        id,
      },
      data: updateEmployeeDto,
    });

    return employee;
  }

  async remove(id: number): Promise<void> {
    await this.prisma.employee.delete({
      where: {
        id,
      },
    });
  }
}
