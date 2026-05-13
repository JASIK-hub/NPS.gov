import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/service/base.service';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { RegisterUserDto } from 'src/modules/auth/dtos/register-user.dto';
import { SurveyActiveQueryDto } from 'src/modules/survey/dto/survey-active-query.dto';
import { SurveyService } from 'src/modules/survey/services/survey.service';
import { Repository } from 'typeorm';
import { UserGender } from '../enums/user-gender.enum';
import { VoteService } from 'src/modules/survey/services/vote.service';

const defaultGroups = [
    { ageGroup: '18-24', count: 0 },
    { ageGroup: '25-34', count: 0 },
    { ageGroup: '35-44', count: 0 },
    { ageGroup: '45-54', count: 0 },
    { ageGroup: '55-64', count: 0 },
    { ageGroup: '65+',    count: 0 },
  ];

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private surveyService: SurveyService,
    private voteService:VoteService
  ) {
    super(userRepository);
  }

  async createUser(body: RegisterUserDto) {
    const user = this.userRepository.create({
      email: body.email,
      password: body.password,
    });
    return await this.userRepository.save(user);
  }

  async findByIdentifier(identifier: string) {
    return await this.userRepository.findOne({
      where: [
        { email: identifier },
        { iin: identifier },
      ],
      select: ['id', 'password', 'role', 'email', 'firstName', 'lastName'],
    });
  }

  async getUserSurveys(userId: number, query: SurveyActiveQueryDto) {
    return await this.surveyService.getUserSurveyList(userId, query);
  }

  async getSurveyParticipationStats() {
    return await this.voteService.getParticipationDynamics()
  }

  async getUserAgeGroup(){
    const rawData=await this.userRepository
    .createQueryBuilder('user')
    .select(
      `CASE 
        WHEN EXTRACT(YEAR FROM AGE(user.birthday)) BETWEEN 18 AND 24 THEN '18-24'
        WHEN EXTRACT(YEAR FROM AGE(user.birthday)) BETWEEN 25 AND 34 THEN '25-34'
        WHEN EXTRACT(YEAR FROM AGE(user.birthday)) BETWEEN 35 AND 44 THEN '35-44'
        WHEN EXTRACT(YEAR FROM AGE(user.birthday)) BETWEEN 45 AND 54 THEN '45-54'
        WHEN EXTRACT(YEAR FROM AGE(user.birthday)) BETWEEN 55 AND 64 THEN '55-64'
        WHEN EXTRACT(YEAR FROM AGE(user.birthday)) >= 65 THEN '65+'
        ELSE 'Other'
      END`, 
      'ageGroup'
    )
    .addSelect('COUNT(user.id)', 'count')
    .groupBy('"ageGroup"')
    .orderBy('MIN(EXTRACT(YEAR FROM AGE(user.birthday)))', 'ASC') 
    .getRawMany();

    return defaultGroups.map(group => {
      const found = rawData.find(d => d.ageGroup === group.ageGroup);
      return {
        ageGroup: group.ageGroup,
        count: found ? parseInt(found.count, 10) : 0
      };
    });
  }

  async getUserGender(){
    const rawData=await this.userRepository
    .createQueryBuilder('user')
    .select('user.gender', 'genderGroup') 
    .addSelect('COUNT(user.id)', 'count')
    .groupBy('user.gender') 
    .getRawMany();

    return rawData.map(item=>({
      gender:item.genderGroup,
      count:parseInt(item.count, 10)
    }))
  }

  async countVotedUsers() {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.vote', 'vote')
      .select('COUNT(DISTINCT user.id)', 'count')
      .getRawOne();
      
    return parseInt(result.count);
  }
}
