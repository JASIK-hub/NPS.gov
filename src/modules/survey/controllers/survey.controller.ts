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
  ApiTags,
} from '@nestjs/swagger';
import { SurveyActiveQueryDto } from '../dto/survey-active-query.dto';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { SurveyService } from '../services/survey.service';
import { SurveyEntity } from 'src/core/db/entities/survey.entity';

@ApiTags('Survey')
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @ApiBearerAuth('Authorization')
  @Get()
  @ApiOperation({ summary: 'Get user voted survey list ' })
  async getSurveys(
    @CurrentUser('id') userId: number,
    @Query() query: SurveyActiveQueryDto,
  ): Promise<SurveyEntity[]> {
    return this.surveyService.getSurveyList(userId, query);
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
