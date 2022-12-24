import { BadRequestException, Injectable } from '@nestjs/common';
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
    const { email, password, name } = createUserDto;
    await this._checkIfUserExists(email);

    const hashedPassword = await this._hashPassword(password);

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const { password: _, ...user } = createdUser;
    return user;
  }

  async findOne(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

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
      throw new BadRequestException('User not found');
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
}
