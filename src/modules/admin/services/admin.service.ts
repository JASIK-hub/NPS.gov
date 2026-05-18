import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/core/base/service/base.service';
import { SurveyService } from 'src/modules/survey/services/survey.service';
import { SurveyTypeService } from 'src/modules/survey/services/survey-type.service';
import { VoteService } from 'src/modules/survey/services/vote.service';
import { AdminCreateSurveyDto } from '../dto/admin-create-survey.dto';
import { OptionService } from 'src/modules/survey/services/option.service';
import { RegionService } from 'src/modules/region/service/region.service';
import { RegionEntity } from 'src/core/db/entities/region.entity';
import { DataSource } from 'typeorm';
import { OptionEntity } from 'src/core/db/entities/option.entity';
import { SurveyEntity } from 'src/core/db/entities/survey.entity';
import { SurveyTypeEntity } from 'src/core/db/entities/survey-type.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { AdminUpdateSurveyDto } from '../dto/admin-update-survey.dto';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';

@Injectable()
export class AdminService {
  constructor(
    private surveyService: SurveyService,
    private surveyTypeService: SurveyTypeService,
    private voteService: VoteService,
    private optionService: OptionService,
    private regionService: RegionService,
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  async createSurvey(body: AdminCreateSurveyDto, userId: number) {
    const user = await this.userService.findOne({
      where: { id: userId },
      relations: ['organization'],
    });
    if (user?.role !== UserRoles.ADMIN) {
      throw new BadRequestException('Only admins can access data');
    }
    if (!user?.organization) {
      throw new BadRequestException('User must belong to an organization');
    }

    const existingSurvey = await this.surveyService.findOne({
      where: {
        title: body.title,
      },
    });

    if (existingSurvey) {
      throw new BadRequestException('Survey with this title already exists');
    }

    const surveyType = await this.surveyTypeService.findOne({
      where: { id: body.typeId },
    });

    if (!surveyType) {
      throw new BadRequestException('Survey type not found');
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
      titleKz: body.titleKz,
      description: body.description,
      descriptionKz: body.descriptionKz,
      subTitle: body.subTitle,
      subTitleKz: body.subTitleKz,
      validUntil: body.validUntil,
      organization: user.organization,
      type: surveyType,
      startDate: body.startDate,
      region,
    };
    return await this.dataSource.transaction(async (em) => {
      const createdSurvey = await em.save(SurveyEntity, createBody);
      if (!createdSurvey) {
        throw new Error('Something went wrong while creating survey');
      }

      const optionsToSave = body.options.map((text, index) => ({
        title: text,
        titleKz: body.optionsKz?.[index],
        survey: createdSurvey,
      }));

      return await em.save(OptionEntity, optionsToSave);
    });
  }

  async getAllSurveys(userId: number, language: string = 'ru') {
    const user = await this.userService.findOne({
      where: { id: userId },
      relations: ['organization'],
    });
    if (user?.role !== UserRoles.ADMIN) {
      throw new BadRequestException('Only admins can access data');
    }
    if (!user?.organization) {
      throw new BadRequestException('User must belong to an organization');
    }

    return await this.surveyService.getSurveysByOrganization(user.organization.id, language);
  }

  async updateSurvey(id: number, body: AdminUpdateSurveyDto, userId: number) {
    const user = await this.userService.findOne({
      where: { id: userId },
      relations: ['organization'],
    });
    if (user?.role !== UserRoles.ADMIN) {
      throw new BadRequestException('Only admins can access data');
    }
    if (!user?.organization) {
      throw new BadRequestException('User must belong to an organization');
    }

    const survey = await this.surveyService.findOne({
      where: { id },
      relations: ['organization'],
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    if (survey.organization.id !== user.organization.id) {
      throw new BadRequestException(
        'You can only update surveys from your organization',
      );
    }

    const updateData: Partial<SurveyEntity> = {};

    if (body.executionStatus !== undefined) {
      updateData.executionStatus = body.executionStatus;
    }

    if (body.finalDecision !== undefined) {
      updateData.finalDecision = body.finalDecision;
    }

    await this.surveyService.update(id, updateData);

    return { message: 'Survey updated successfully' };
  }

  async deleteSurvey(id: number, userId: number) {
    const user = await this.userService.findOne({
      where: { id: userId },
      relations: ['organization'],
    });
    if (user?.role !== UserRoles.ADMIN) {
      throw new BadRequestException('Only admins can access data');
    }
    if (!user?.organization) {
      throw new BadRequestException('User must belong to an organization');
    }

    const survey = await this.surveyService.findOne({
      where: { id },
      relations: ['organization'],
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    if (survey.organization.id !== user.organization.id) {
      throw new BadRequestException(
        'You can only delete surveys from your organization',
      );
    }

    await this.surveyService.delete(id);

    return { message: 'Survey deleted successfully' };
  }

  async getStats(userId: number) {
    const user = await this.userService.findOne({
      where: { id: userId },
      relations: ['organization'],
    });
    if (user?.role !== UserRoles.ADMIN) {
      throw new BadRequestException('Only admins can access data');
    }
    if (!user?.organization) {
      throw new BadRequestException('User must belong to an organization');
    }

    const surveys = await this.surveyService.getSurveysByOrganization(
      user.organization.id,
    );
    const activeSurveys = surveys.filter((s) => s.isActive).length;
    const draftSurveys = surveys.filter(
      (s) => !s.isActive && s.executionStatus === 'in progress',
    ).length;
    const completedSurveys = surveys.filter(
      (s) => !s.isActive || s.executionStatus === 'implemented',
    ).length;
    const totalVotes = surveys.reduce((sum, s) => sum + (s.votedCount || 0), 0);

    return {
      activeSurveys,
      draftSurveys,
      completedSurveys,
      totalVotes,
    };
  }

  async getParticipationStats(userId: number) {
    const user = await this.userService.findOne({
      where: { id: userId },
      relations: ['organization'],
    });
    if (user?.role !== UserRoles.ADMIN) {
      throw new BadRequestException('Only admins can access data');
    }
    if (!user?.organization) {
      throw new BadRequestException('User must belong to an organization');
    }

    return this.voteService.getAdminParticipationStats(user.organization.id);
  }
}
