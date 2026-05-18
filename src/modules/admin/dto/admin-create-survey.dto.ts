import { RegionCodes } from 'src/modules/survey/enums/region.enum';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdminCreateSurveyDto {
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @Transform(({ value }) => value.trim())
  title: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  titleKz?: string;

  @ApiProperty({ maxLength: 250 })
  @IsString()
  @Transform(({ value }) => value.trim())
  description: string;

  @ApiPropertyOptional({ maxLength: 250 })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  descriptionKz?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  subTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  subTitleKz?: string;

  @ApiPropertyOptional({ enum: RegionCodes })
  @IsEnum(RegionCodes)
  @IsOptional()
  region?: RegionCodes;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  typeId: number;

  @ApiProperty({ example: '2026-12-31' })
  @IsDateString()
  startDate: string;

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

  @ApiPropertyOptional({
    type: [String],
    description: 'Array of option titles in Kazakh',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  optionsKz?: string[];
}
