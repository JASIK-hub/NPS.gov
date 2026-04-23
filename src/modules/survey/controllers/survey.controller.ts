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
import { SurveryService } from '../services/survey.service';
import { SurveyEntity } from 'src/core/db/entities/survey.entity';

@ApiTags('survey')
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveryService) {}

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get survey list' })
  async getSurveys(
    @CurrentUser('id') userId: number,
    @Query() query: SurveyActiveQueryDto,
  ): Promise<SurveyEntity[]> {
    return this.surveyService.getSurveyList(userId, query);
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get survey by Id' })
  async getSurvey(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SurveyEntity> {
    return this.surveyService.getSurvey(id);
  }

  @ApiBearerAuth()
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
