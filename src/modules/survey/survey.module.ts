import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyEntity } from 'src/core/db/entities/survey.entity';
import { VoteEntity } from 'src/core/db/entities/vote.entity';
import { VoteService } from './services/vote.service';
import { SurveyService } from './services/survey.service';
import { SurveyController } from './controllers/survey.controller';
import { UserModule } from '../user/user.module';
import { OptionService } from './services/option.service';
import { RegionService } from './services/region.service';
import { RegionEntity } from 'src/core/db/entities/region.entity';
import { OptionEntity } from 'src/core/db/entities/option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VoteEntity,
      SurveyEntity,
      RegionEntity,
      OptionEntity,
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [SurveyController],
  providers: [VoteService, SurveyService, OptionService, RegionService],
  exports: [VoteService, SurveyService, OptionService, RegionService],
})
export class SurveyModule {}
