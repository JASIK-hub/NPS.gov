import { BadGatewayException, forwardRef, Inject, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/service/base.service';
import { RegionEntity } from 'src/core/db/entities/region.entity';
import { Repository } from 'typeorm';
import { RegionCodes } from '../../survey/enums/region.enum';
import { VoteService } from 'src/modules/survey/services/vote.service';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class RegionService extends BaseService<RegionEntity> {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepo: Repository<RegionEntity>,
    private voteService:VoteService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService
  ) {
    super(regionRepo);
  }

  async getRegionsWithStats() {
    const totalVotes = await this.voteService.count({});

    const stats = await this.regionRepo
      .createQueryBuilder('region')
      .leftJoin(
        'survey', 
        'survey', 
        'survey.region_id = region.id AND survey.validUntil <= :now', 
        { now: new Date() }
      )
      .select([
        'region.id AS id',
        'region.name AS name',
      ])
      .addSelect('SUM(COALESCE(survey."votedCount", 0))', 'total_region_votes')
      .groupBy('region.id')
      .orderBy('total_region_votes', 'DESC')
      .getRawMany();

    return stats.map(reg => {
      const vCount = parseInt(reg.total_region_votes, 10) || 0;
      
      return {
        id: reg.id,
        name: reg.name,
        votes: vCount,
        activity: totalVotes > 0 
          ? Math.round((vCount / totalVotes) * 100) 
          : 0
      };
    });
  }

  async getRegionsUserStats() {
  const totalUsers = await this.userService.count({});

  const stats = await this.regionRepo
    .createQueryBuilder('region')
    .leftJoin('survey', 'survey', 'survey.region_id = region.id')
    .leftJoin('vote', 'vote', 'vote.surveyId = survey.id')
    .leftJoin('user', 'user', 'vote.userId = user.id')
    .select([
      'region.id AS id',
      'region.name AS name',
    ])
    .addSelect('COUNT(DISTINCT user.id)', 'participants')
    .addSelect('COUNT(vote.id)', 'votes')
    .groupBy('region.id')
    .addGroupBy('region.name')
    .getRawMany();

  return stats.map(reg => {
    const pCount = parseInt(reg.participants, 10) || 0;
    const vCount = parseInt(reg.votes, 10) || 0;

    return {
      id: reg.id,
      name: reg.name,
      participants: pCount,
      votes: vCount,
      activity: totalUsers > 0 
        ? Math.round((pCount / totalUsers) * 100) 
        : 0
    };
  });
}
}
