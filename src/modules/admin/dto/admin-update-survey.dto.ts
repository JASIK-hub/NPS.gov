import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SurveyExecutionStatus } from 'src/modules/survey/enums/survey-execution.enum';

export class AdminUpdateSurveyDto {
  @ApiPropertyOptional({ enum: SurveyExecutionStatus })
  @IsEnum(SurveyExecutionStatus)
  @IsOptional()
  executionStatus?: SurveyExecutionStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  finalDecision?: string;
}
