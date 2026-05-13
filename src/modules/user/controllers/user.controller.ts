import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { SurveyEntity } from 'src/core/db/entities/survey.entity';
import { SurveyActiveQueryDto } from 'src/modules/survey/dto/survey-active-query.dto';
import { Public } from 'src/core/decorators/public.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('Authorization')
  @Get('survey')
  @ApiOperation({ summary: 'Get user voted survey list ' })
  async getUserSurveys(
    @CurrentUser('id') userId: number,
    @Query() query: SurveyActiveQueryDto,
  ): Promise<SurveyEntity[]> {
    return this.userService.getUserSurveys(userId, query);
  }

  
  @Public()
  @Get('survey/participation/statistic')
  @ApiOperation({ summary: 'Get survey participation statistics for 7 days' })
  async getSurveyParticipationStats() {
    return this.userService.getSurveyParticipationStats()
  }
  
  @Public()
  @Get('statistic/age-group')
  @ApiOperation({ summary: 'Get age group of users' })
  async getUserAgeGroup(
  ){
    return this.userService.getUserAgeGroup();
  }

  @Public()
  @Get('statistic/gender')
  @ApiOperation({ summary: 'Get age group of users' })
  async getUserGender() {
    return this.userService.getUserGender();
  }
}
