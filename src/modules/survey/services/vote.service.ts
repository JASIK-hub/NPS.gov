import { VoteEntity } from '../../../core/db/entities/vote.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/service/base.service';
import { Repository } from 'typeorm';

@Injectable()
export class VoteService extends BaseService<VoteEntity> {
  constructor(
    @InjectRepository(VoteEntity)
    private voteRepo: Repository<VoteEntity>,
  ) {
    super(voteRepo);
  }
}
