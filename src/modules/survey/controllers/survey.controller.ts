import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SurveyActiveQueryDto } from '../dto/survey-active-query.dto';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { SurveyService } from '../services/survey.service';
import { SurveyEntity } from 'src/core/db/entities/survey.entity';
import { Public } from 'src/core/decorators/public.decorator';
import { SurveyType } from '../enums/survey-type.enum';

@ApiTags('Survey')
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Public()
  @Get('type')
  @ApiOperation({ summary: 'Get available survey types' })
  @ApiResponse({
    type: [String],
    status: 200,
  })
  async getTypes() {
    return Object.values(SurveyType);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get survey list' })
  @ApiQuery({
    name:'isActive',
    type:Boolean
  })
  async getSurveys(
    @Query('isActive') isActive:boolean,
  ): Promise<SurveyEntity[]> {
    return this.surveyService.getSurveyList(isActive);
  }

  @ApiBearerAuth('Authorization')
  @Get(':id')
  @ApiOperation({ summary: 'Get survey by Id' })
  async getSurvey(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SurveyEntity> {
    return this.surveyService.getSurvey(id);
  }

  @ApiBearerAuth('Authorization')
  @Post(':id/vote')
  @ApiQuery({
    name: 'optionId',
    type: Number,
  })
  @ApiOperation({ summary: 'Vote for survey' })
  async voteForSurvey(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Query('optionId') optionId: number,
  ) {
    return this.surveyService.voteForSurvey(id, userId, optionId);
  }
}
