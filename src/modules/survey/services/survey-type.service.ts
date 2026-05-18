import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/core/base/service/base.service';
import { SurveyTypeEntity } from 'src/core/db/entities/survey-type.entity';

@Injectable()
export class SurveyTypeService extends BaseService<SurveyTypeEntity> {
  constructor(
    @InjectRepository(SurveyTypeEntity)
    private surveyTypeRepository: Repository<SurveyTypeEntity>,
  ) {
    super(surveyTypeRepository);
  }

  async getAllTypes() {
    return this.surveyTypeRepository.find({
      order: { id: 'ASC' },
    });
  }

  async getTypeStats() {
    return await this.surveyTypeRepository
      .createQueryBuilder('type')
      .leftJoin('type.surveys', 'survey')
      .select('type.id', 'id')
      .addSelect('type.name', 'name')
      .addSelect('type.nameKz', 'nameKz')
      .addSelect('type.nameRu', 'nameRu')
      .addSelect('COUNT(survey.id)', 'count')
      .groupBy('type.id')
      .addGroupBy('type.name')
      .addGroupBy('type.nameKz')
      .addGroupBy('type.nameRu')
      .getRawMany();
  }
}
