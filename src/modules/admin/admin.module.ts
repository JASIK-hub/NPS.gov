import { Module } from '@nestjs/common';
import { SurveyModule } from '../survey/survey.module';

@Module({
  imports: [SurveyModule],
})
export class AdminModule {}
