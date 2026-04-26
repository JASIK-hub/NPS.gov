import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/service/base.service';
import { RegionEntity } from 'src/core/db/entities/region.entity';
import { Repository } from 'typeorm';
import { RegionCodes } from '../enums/region.enum';

@Injectable()
export class RegionService extends BaseService<RegionEntity> {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepo: Repository<RegionEntity>,
  ) {
    super(regionRepo);
  }
}
