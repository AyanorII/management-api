import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreateEmployeeDto } from './dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employee.repository';
import { EmployeeDocument } from './schemas/employee.schema';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepository: EmployeesRepository) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<EmployeeDocument> {
    createEmployeeDto.startedAt =
      createEmployeeDto.startedAt || new Date().toISOString();

    try {
      const employee = this.employeesRepository.create(createEmployeeDto);
      return employee;
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }

  async findAll(
    filterQuery?: FilterQuery<EmployeeDocument>,
    // TODO: add pagination params
  ): Promise<EmployeeDocument[]> {
    const employees = await this.employeesRepository.findAll(filterQuery);
    return employees;
  }

  async findOne(
    filterQuery: FilterQuery<EmployeeDocument>,
  ): Promise<EmployeeDocument> {
    const employee = await this.employeesRepository.findOne(filterQuery);

    if (!employee) {
      throw new NotFoundException(`Employee not found`);
    }

    return employee;
  }

  async update(
    filterQuery: FilterQuery<EmployeeDocument>,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeDocument> {
    try {
      const employee = await this.employeesRepository.update(
        filterQuery,
        updateEmployeeDto,
      );

      if (!employee) {
        throw new NotFoundException(`Employee not found`);
      }

      return employee;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async remove(filterQuery: FilterQuery<EmployeeDocument>): Promise<void> {
    await this.employeesRepository.delete(filterQuery);
  }
}
