import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtGuard } from '../common/guards/jwt.guard';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import { HttpStatus, Delete } from '@nestjs/common';

@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
@UseGuards(JwtGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @GetUser() user: UserDocument,
  ) {
    return this.employeesService.create({
      userId: user.id,
      ...createEmployeeDto,
    });
  }

  @Get()
  findAll(@GetUser() user: UserDocument) {
    return this.employeesService.findAll({ userId: user.id });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: UserDocument) {
    return this.employeesService.findOne({ id, userId: user.id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser() user: UserDocument,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(
      { id, userId: user.id },
      updateEmployeeDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number, @GetUser() user: UserDocument) {
    return this.employeesService.remove({ id, userId: user.id });
  }
}
