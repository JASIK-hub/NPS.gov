import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export class BaseService<T extends { id: number }> {
  constructor(protected readonly repository: Repository<T>) {}

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }

  async find(options: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async count(options: FindManyOptions<T>): Promise<number> {
    return await this.repository.count(options);
  }

  async createOne(entity:DeepPartial<T>):Promise<T>{
    return this.repository.create(entity)
  }
}
