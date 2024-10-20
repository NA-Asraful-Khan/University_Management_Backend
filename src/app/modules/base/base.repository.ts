/* eslint-disable no-unused-vars */
import mongoose, { Model, Document } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { baseConstant } from './base.constant';
import { PaginationResult } from '../../interface/pagination';

export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async findPaginationQuery(
    query: Record<string, unknown>,
  ): Promise<PaginationResult<T>> {
    const Query = new QueryBuilder(this.model.find(), query)
      .search(baseConstant)
      .filter()
      .sort()
      .paginate()
      .fields();
    if (query._id && !mongoose.Types.ObjectId.isValid(query._id as string)) {
      throw new Error('Invalid Id');
    }
    const result = await Query.modelQuery;
    const pagination = await Query.countTotal();
    return { result, pagination };
  }
  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async softDelete(id: string): Promise<T | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  async delete(id: string): Promise<T | null> {
    const result = await this.model.findByIdAndDelete(id);
    // Ensure the result is a valid document or null
    return result as unknown as T | null;
  }
}
