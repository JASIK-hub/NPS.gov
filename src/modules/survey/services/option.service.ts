import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/service/base.service';
import { OptionEntity } from 'src/core/db/entities/option.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class OptionService extends BaseService<OptionEntity> {
  constructor(
    @InjectRepository(OptionEntity)
    private readonly optionRepo: Repository<OptionEntity>,
  ) {
    super(optionRepo);
  }
}
