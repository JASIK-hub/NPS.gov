import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
  ObjectLiteral,
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

  async save(entities: DeepPartial<T> | DeepPartial<T>[]): Promise<any> {
    return await this.repository.save(entities as any);
  }

  async count(options: FindManyOptions<T>): Promise<number> {
    return await this.repository.count(options);
  }

  async createOne(entity: DeepPartial<T>): Promise<T> {
    const newEntity=this.repository.create(entity);
    return await this.repository.save(newEntity);
  }

  async update(
    criteria: string | number | string[] | number[] | FindOptionsWhere<T>,
    entity: DeepPartial<T>
  ): Promise<void> {
    await this.repository.update(criteria, entity as any);
  }
}
