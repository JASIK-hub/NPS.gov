import { RegionCodes } from 'src/modules/survey/enums/region.enum';
import {
  ApiProcessingResponse,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { SurveyType } from 'src/modules/survey/enums/survey-type.enum';

export class AdminCreateSurveyDto {
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @Transform(({ value }) => value.trim())
  title: string;

  @ApiProperty({ maxLength: 250 })
  @IsString()
  @Transform(({ value }) => value.trim())
  description: string;

  @ApiPropertyOptional({ enum: RegionCodes })
  @IsEnum(RegionCodes)
  @IsOptional()
  region?: RegionCodes;

  @ApiProperty({ enum: SurveyType })
  @IsEnum(SurveyType)
  type: SurveyType;

  @ApiProperty({ example: '2026-12-31' })
  @IsDateString()
  validUntil: string;

  @ApiProperty({
    type: [String],
    description: 'Array of option titles',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  options: string[];
}
