import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
{
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const user = await this.usersRepository.create(createUserDto);
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('User already exists');
      }
    }
  }

  async findAll(): Promise<UserDocument[]> {
    const users = await this.usersRepository.findAll({});

    users.forEach((user) => delete user.password);

    return users;
  }

  async findOne(filterQuery: FilterQuery<UserDocument>): Promise<UserDocument> {
    const user = await this.usersRepository.findOne(filterQuery);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    delete user.password;

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.usersRepository.update({ id }, updateUserDto);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    delete user.password;

    return user;
  }

  async removeRefreshToken(id: string): Promise<void> {
    await this.update(id, { refreshToken: null });
  }
}
