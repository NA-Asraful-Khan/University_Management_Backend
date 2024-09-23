/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import { BaseRepository } from './base.repository';

export class BaseService<T extends Document> {
  constructor(protected repository: BaseRepository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<T[]> {
    return this.repository.findAll();
  }
  async findPaginationQuery(query: Record<string, unknown>): Promise<T[]> {
    return this.repository.findPaginationQuery(query);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.repository.update(id, data);
  }

  async softDelete(id: string): Promise<T | null> {
    return this.repository.softDelete(id);
  }

  async delete(id: string): Promise<T | null> {
    return this.repository.delete(id);
  }
}
