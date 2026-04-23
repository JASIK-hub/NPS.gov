import { BadGatewayException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/service/base.service';
import { SurveryService } from 'src/modules/survey/services/survey.service';
import { AdminCreateSurveyDto } from '../dto/admin-create-survey.dto';
import { title } from 'process';

@Injectable()
export class AdminService {
  constructor(private surveyService: SurveryService) {}

  async createSurvey(body: AdminCreateSurveyDto) {
    const existingSurvey = await this.surveyService.find({
      where: {
        title: body.title,
      },
    });
    if (existingSurvey) {
      throw new BadGatewayException('Survey with this title already exists');
    }
    const createBody = await this.surveyService.createOne({
      title: body.title,
      description: body.description,
      region: {
        code: body.region,
      },
      validUntil: body.validUntil,
      type: body.type,
      startDate: body.startDate,
      options: body.options.map((text) => ({ title: text })),
    });
    const created = await this.surveyService.save(createBody);
    if (!created) {
      throw new Error('Something went wrong while creating survey');
    }
    return { message: 'Success' };
  }
}
