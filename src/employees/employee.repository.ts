import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/base.repository';
import { Employee, EmployeeDocument } from './schemas/employee.schema';

@Injectable()
export class EmployeesRepository extends BaseRepository<EmployeeDocument> {
  constructor(
    @InjectModel(Employee.name) employeeModel: Model<EmployeeDocument>,
  ) {
    super(employeeModel);
  }
}
