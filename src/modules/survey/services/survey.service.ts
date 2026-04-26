import { Repository } from 'typeorm';
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

@Injectable()
export class SurveyService extends BaseService<SurveyEntity> {
  constructor(
    @InjectRepository(SurveyEntity)
    private surveyRepository: Repository<SurveyEntity>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private voteService: VoteService,
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

  async getSurveyList(query: SurveyActiveQueryDto) {
    const surveys = await this.surveyRepository.find({
      where: {
        isActive: query.isActive,
      },
    });
    return surveys;
  }

  async getSurvey(id: number) {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: ['vote', 'vote.user', 'options'],
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
}
