import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let prisma: PrismaService;

  const userDto: CreateUserDto = {
    name: 'John Doe',
    email: 'johndoe@email.com',
    password: 'P$ssW0rd!',
    companyName: 'Company',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.cleanDatabase();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('Create user', () => {
    it('should create a user', async () => {
      const user = await usersService.create(userDto);

      expect(user).toHaveProperty('id');
      expect(user).not.toHaveProperty('password');
    });

    it('should not create a user if email is already in database', async () => {
      await usersService.create(userDto);

      await expect(usersService.create(userDto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should store the hashed password in the database', async () => {
      const user = await usersService.create(userDto);
      const { id } = user;

      const foundUser = await prisma.user.findUnique({
        where: { id },
      });

      expect(foundUser.password).not.toBe(userDto.password);
    });
  });

  describe('Read user', () => {
    it('should return a user', async () => {
      const user = await usersService.create(userDto);
      const { id, email } = user;

      await expect(usersService.findOneById(id)).resolves.toEqual(
        expect.objectContaining({
          id,
        }),
      );
      await expect(usersService.findOneByEmail(email)).resolves.toEqual(
        expect.objectContaining({
          email,
        }),
      );
    });

    it('should throw an exception if user is not found', async () => {
      const id = 1000000;

      await expect(usersService.findOneById(id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should not expose the password', async () => {
      const user = await usersService.create(userDto);

      expect(user).not.toHaveProperty('password');
    });
  });

  describe('Update user', () => {
    it('should update a user', async () => {
      const user = await usersService.create(userDto);
      const { id } = user;

      const newName = 'Foo Bar';
      const newEmail = 'foobar@email.com';

      const updatedUser = await usersService.update(id, {
        name: newName,
        email: newEmail,
      });

      expect(updatedUser).toEqual(
        expect.objectContaining({
          id,
          name: newName,
          email: newEmail,
        }),
      );
    });
  });
});
