import { VoteEntity } from '../../../core/db/entities/vote.entity';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/service/base.service';

@Injectable()
export class VoteService extends BaseService<VoteEntity> {}
