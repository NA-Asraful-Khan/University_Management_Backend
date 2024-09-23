/* eslint-disable no-unused-vars */
import { Model, Document } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { baseConstant } from './base.constant';

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

  async findPaginationQuery(query: Record<string, unknown>): Promise<T[]> {
    const Query = new QueryBuilder(this.model.find(), query)
      .search(baseConstant)
      .filter()
      .sort()
      .paginate()
      .fields();

    return await Query.modelQuery;
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
