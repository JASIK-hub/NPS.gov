import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { BaseService } from 'src/core/base/service/base.service';
import { SurveyService } from 'src/modules/survey/services/survey.service';
import { AdminCreateSurveyDto } from '../dto/admin-create-survey.dto';
import { title } from 'process';
import { OptionService } from 'src/modules/survey/services/option.service';
import { RegionService } from 'src/modules/survey/services/region.service';
import { RegionEntity } from 'src/core/db/entities/region.entity';
import { DataSource } from 'typeorm';
import { OptionEntity } from 'src/core/db/entities/option.entity';
import { SurveyEntity } from 'src/core/db/entities/survey.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';

@Injectable()
export class AdminService {
  constructor(
    private surveyService: SurveyService,
    private optionService: OptionService,
    private regionService: RegionService,
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  async createSurvey(body: AdminCreateSurveyDto, userId: number) {
    const user = await this.userService.findOne({
      where: { id: userId },
    });
    if (user?.role !== UserRoles.ADMIN) {
      throw new BadRequestException('Only admin can create survey');
    }
    const existingSurvey = await this.surveyService.findOne({
      where: {
        title: body.title,
      },
    });
    if (existingSurvey) {
      throw new BadRequestException('Survey with this title already exists');
    }

    let region: RegionEntity | null = null;
    if (body.region) {
      region = await this.regionService.findOne({
        where: {
          code: body.region,
        },
      });
      if (!region) {
        throw new BadRequestException('Region with this code does not exist');
      }
    }
    const createBody = {
      title: body.title,
      description: body.description,
      validUntil: body.validUntil,
      organization: user.organization,
      type: body.type,
      startDate: body.startDate,
      region,
    };
    await this.dataSource.transaction(async (em) => {
      const createdSurvey = await em.save(SurveyEntity, createBody);
      if (!createdSurvey) {
        throw new Error('Something went wrong while creating survey');
      }

      const optionsToSave = body.options.map((text) => ({
        title: text,
        survey: createdSurvey,
      }));

      await em.save(OptionEntity, optionsToSave);
    });
    return { message: 'Success' };
  }
}
