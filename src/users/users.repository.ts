import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findOne(filterQuery: FilterQuery<UserDocument>): Promise<UserDocument> {
    return this.userModel.findOne(filterQuery);
  }

  async findAll(
    filterQuery?: FilterQuery<UserDocument>,
  ): Promise<UserDocument[]> {
    return this.userModel.find(filterQuery).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findOneAndUpdate(
        {
          _id: id,
        },
        updateUserDto,
        {
          new: true,
          lean: true,
        },
      )
      .exec();
  }
}
