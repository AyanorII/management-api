import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithoutPassword } from './interfaces';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const { email, password, name, companyName } = createUserDto;
    await this._checkIfUserExists(email);

    const hashedPassword = await this._hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        companyName,
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        refreshToken: true,
      },
    });

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this._findOneBy('email', email);
    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this._findOneBy('id', id);
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    const { password, ...user } = updatedUser;

    return user;
  }

  async removeRefreshToken(id: number): Promise<void> {
    // Using updateMany because we need to update only the user that has a refresh token.
    const user = await this.prisma.user.updateMany({
      where: {
        id,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });

    if (user.count === 0) {
      throw new NotFoundException('User not found');
    }
  }

  // Private
  private async _checkIfUserExists(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }
  }

  private async _hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async _findOneBy(
    field: string,
    value: string | number,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        [field]: value,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
