import { BadRequestException } from '@nestjs/common';
import {
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { IBaseRepository } from './interfaces/base-repository.interface';
export abstract class BaseRepository<T extends Document>
  implements IBaseRepository
{
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.entityModel
      .findOne(
        entityFilterQuery,
        {
          __v: 0,
          ...projection,
        },
        options,
      )
      .exec();
  }

  async findAll(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
    options?: QueryOptions,
  ): Promise<T[] | null> {
    return this.entityModel.find(
      entityFilterQuery,
      {
        _v: 0,
        ...projection,
      },
      options,
    );
  }

  async create(createEntityData: unknown): Promise<T> {
    try {
      const entity = new this.entityModel(createEntityData);
      return entity.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async update(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<T | null> {
    try {
      const entity = await this.entityModel.findOneAndUpdate(
        entityFilterQuery,
        updateEntityData,
        {
          new: true,
        },
      );

      return entity;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async delete(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }
}
