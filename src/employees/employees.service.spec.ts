import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Gender, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

describe('EmployeesService', () => {
  let employeesService: EmployeesService;
  let prisma: PrismaService;
  let user: User;

  const createEmployeeDto: CreateEmployeeDto = {
    name: 'Foo Bar',
    gender: Gender.FEMALE,
    phone: '1234567890',
    email: 'foobar@email.com',
    salary: 1000,
  };

  const updateEmployeeDto: UpdateEmployeeDto = {
    name: 'Updated name',
    gender: Gender.MALE,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesService, PrismaService],
    }).compile();

    employeesService = module.get<EmployeesService>(EmployeesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'password',
        companyName: 'John Doe Company',
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
    expect(employeesService).toBeDefined();
  });

  describe('Create', () => {
    it('should create a employee for the current user', async () => {
      const employee = await employeesService.create(createEmployeeDto, user);

      expect(employee).toHaveProperty('id');
      expect(employee).toHaveProperty('name', createEmployeeDto.name);
      expect(employee).toHaveProperty('startedAt', expect.any(Date));
      expect(employee).toHaveProperty('gender', Gender.FEMALE || Gender.MALE);
    });
  });

  describe('FindAll', () => {
    it('should return all of the employees of the current user', async () => {
      await employeesService.create(createEmployeeDto, user);

      const employees = await employeesService.findAll(user);

      expect(employees).toHaveLength(1);
      expect(employees[0].name).toBe(createEmployeeDto.name);
    });

    it("should not be able to see other user's employees", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: 'Jane Doe',
          email: 'jane@doe.com',
          password: 'password',
          companyName: 'Jane Doe Company',
        },
      });

      const otherUserEmployee = await employeesService.create(
        createEmployeeDto,
        otherUser,
      );

      const employees = await employeesService.findAll(user);

      expect(employees).not.toContain(otherUserEmployee);
    });
  });

  describe('FindOne', () => {
    it('should return one employee', async () => {
      const employee = await employeesService.create(createEmployeeDto, user);
      await expect(
        employeesService.findOne(employee.id, user),
      ).resolves.toHaveProperty('id', employee.id);
    });

    it('should throw a NotFoundException if not found', async () => {
      const nonExistingId = -1;

      await expect(
        employeesService.findOne(nonExistingId, user),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("should not be able to see other user's employee", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: 'Jane Doe',
          email: 'jane@doe.com',
          password: 'password',
          companyName: 'Jane Doe Company',
        },
      });

      const otherUserEmployee = await employeesService.create(
        createEmployeeDto,
        otherUser,
      );

      await expect(
        employeesService.findOne(otherUserEmployee.id, user),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('Update', () => {
    it('should be able to update an employee', async () => {
      const employee = await employeesService.create(createEmployeeDto, user);

      const updatedEmployee = await employeesService.update(
        employee.id,
        updateEmployeeDto,
        user,
      );

      expect(updatedEmployee).toHaveProperty('id', employee.id);
      expect(updatedEmployee).toHaveProperty('name', updateEmployeeDto.name);
      expect(updatedEmployee).toHaveProperty(
        'gender',
        updateEmployeeDto.gender,
      );
    });

    it("should not be able to update other user's employee", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: 'Jane Doe',
          email: 'jane@doe.com',
          password: 'password',
          companyName: 'Jane Doe Company',
        },
      });

      const otherUserEmployee = await employeesService.create(
        createEmployeeDto,
        otherUser,
      );

      await expect(
        employeesService.update(otherUserEmployee.id, updateEmployeeDto, user),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw a NotFoundException if employee was not found', async () => {
      const nonExistingId = -1;

      await expect(
        employeesService.update(nonExistingId, updateEmployeeDto, user),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('Remove', () => {
    it('should delete an employee', async () => {
      const employee = await employeesService.create(createEmployeeDto, user);

      await expect(
        employeesService.remove(employee.id, user),
      ).resolves.toBeUndefined();

      await expect(
        employeesService.findOne(employee.id, user),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("should not be able to delete another user's employee", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: 'Jane Doe',
          email: 'jane@doe.com',
          password: 'password',
          companyName: 'Jane Doe Company',
        },
      });

      const employee = await employeesService.create(createEmployeeDto, user);

      await expect(
        employeesService.remove(employee.id, otherUser),
      ).rejects.toBeInstanceOf(NotFoundException);

      await expect(
        employeesService.remove(employee.id, user),
      ).resolves.toBeUndefined();
    });
  });
});
