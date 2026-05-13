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

  async getParticipationDynamics() {
    const rawData = await this.voteRepo.query(`
      SELECT 
        TO_CHAR(day, 'DD.MM') as date,
        COALESCE(COUNT(v.id), 0) as count
      FROM 
        generate_series(
          CURRENT_DATE - INTERVAL '6 days', 
          CURRENT_DATE, 
          '1 day'::interval
        ) day
      LEFT JOIN "vote" v ON DATE(v."createdAt") = DATE(day)
      GROUP BY day
      ORDER BY day ASC
    `);

    return rawData.map(item => ({
      date: item.date,
      count: parseInt(item.count, 10)
    }));
  }
}
