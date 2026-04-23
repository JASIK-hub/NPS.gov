import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyEntity } from 'src/core/db/entities/survey.entity';
import { VoteEntity } from 'src/core/db/entities/vote.entity';
import { VoteService } from './services/vote.service';
import { SurveryService } from './services/survey.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoteEntity, SurveyEntity])],
  providers: [VoteService, SurveryService],
})
export class SurveyModule {}
