import { IsNull, Repository } from 'typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/core/base/service/base.service';
import { SurveyEntity } from 'src/core/db/entities/survey.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyActiveQueryDto } from '../dto/survey-active-query.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { VoteService } from 'src/modules/survey/services/vote.service';
import { RegionService } from '../../region/service/region.service';

@Injectable()
export class SurveyService extends BaseService<SurveyEntity> {
  constructor(
    @InjectRepository(SurveyEntity)
    private surveyRepository: Repository<SurveyEntity>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private voteService: VoteService,
    private regionService:RegionService
  ) {
    super(surveyRepository);
  }

  async getUserSurveyList(
    id: number,
    query: SurveyActiveQueryDto,
  ): Promise<SurveyEntity[]> {
    const user = await this.userService.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    const userSurveys = await this.surveyRepository.find({
      where: {
        vote: {
          user: {
            id,
          },
        },
        isActive: query.isActive,
      },
    });
    return userSurveys;
  }


  async getSurveyTypeStats(){
    const rawData=await this.surveyRepository
      .createQueryBuilder('survey')
      .select('survey.type', 'type')
      .addSelect('COUNT(survey.id)','count')
      .groupBy('survey.type')
      .getRawMany();

    return rawData.map(item => ({
      type: item.type,
      count: Number(item.count)
    }));
  }

  async getStatistics(){
    const activeSurveys = await this.surveyRepository.count({
      where: {
        isActive:true,
      }
    });
    const totalVotes = await this.voteService.count({});
    const regionsCount = await this.regionService.count({})

    const totalUsers = await this.userService.count({});
    const votedUsersCount = await this.userService.countVotedUsers()

    const participationRate = totalUsers > 0 
      ? (Number(votedUsersCount) / totalUsers) * 100 
      : 0;
    return {
      totalVotes,
      participationRate,
      activeSurveys,
      regionsCount
    }
  }

  async getSurveyList(isActive: boolean) {
    const totalUsers = await this.userService.count({});

    const surveys = await this.surveyRepository.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.region', 'region')
      .leftJoinAndSelect('survey.organization', 'organization')
      .loadRelationCountAndMap('survey.votedCount', 'survey.vote') 
      .where('survey.isActive = :isActive', { isActive })
      .getMany();

    const surveysWithStats = surveys.map(survey => {
      const votesCount = survey.votedCount || 0;
      const participationRate = totalUsers > 0 
        ? parseFloat(((votesCount / totalUsers) * 100).toFixed(1)) 
        : 0;

      return {
        ...survey,
        participationRate, 
      };
    });

   return surveysWithStats;
  }

  async checkUserParticipation(userId:number,id:number):Promise<boolean>{
    const survey= await this.surveyRepository.findOne({
      where:{
        id,
        vote:{
          user:{
            id:userId
          }
        }
      }
    })
    if(!survey){
      return false
    }
    return true
  }

  async getSurvey(id: number) {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: ['vote','vote.user','vote.option','options', 'region', 'organization'],
    });
    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    return survey;
  }

  async voteForSurvey(id: number, userId: number, optionId: number) {
    const user = await this.userService.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const votedSurvey = await this.surveyRepository.findOne({
      where: { id, vote: { user: { id: userId } } },
    });
    if (votedSurvey) {
      throw new BadRequestException('User has already voted');
    }

    const survey = await this.surveyRepository.findOne({
      where: { id, isActive: true },
      relations: ['options'],
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    const isOptionValid = survey.options.some(
      (option) => option.id === optionId,
    );

    if (!isOptionValid) {
      throw new BadRequestException(
        'This option does not exist in this survey',
      );
    }

    const voteBody = await this.voteService.createOne({
      user,
      option: { id: optionId },
      survey,
    });

    await this.voteService.save(voteBody);
    const voted = await this.surveyRepository.increment(
      { id: survey.id },
      'votedCount',
      1,
    );

    if (!voted.affected) {
      throw new Error();
    }
    return { message: 'Vote cast successfully' };
  }

  async getAllSurveysWithRelations() {
    return this.surveyRepository.find({
      relations: ['vote', 'vote.user', 'vote.option', 'options', 'region', 'organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSurveysByOrganization(organizationId: number) {
    return this.surveyRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['vote', 'vote.user', 'vote.option', 'options', 'region', 'organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateData: Partial<SurveyEntity>) {
    await this.surveyRepository.update({ id }, updateData);
  }

  async delete(id: number) {
    await this.surveyRepository.delete({ id });
  }
}
