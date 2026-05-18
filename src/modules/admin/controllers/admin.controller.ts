import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AdminCreateSurveyDto } from '../dto/admin-create-survey.dto';
import { AdminUpdateSurveyDto } from '../dto/admin-update-survey.dto';
import { AdminService } from '../services/admin.service';
import { CurrentUser } from 'src/core/decorators/user.decorator';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth('Authorization')
  @Post('survey')
  @ApiOperation({ summary: 'Create survey for admin' })
  @ApiResponse({ status: 201, description: 'Survey created successfully' })
  async createSurvey(
    @CurrentUser('id') userId: number,
    @Body() body: AdminCreateSurveyDto,
  ) {
    return this.adminService.createSurvey(body, userId);
  }

  @ApiBearerAuth('Authorization')
  @Get('survey/participation/statistic')
  @ApiOperation({ summary: 'Get participation statistics' })
  @ApiResponse({ description: 'Participation statistics' })
  async getParticipationStats(@CurrentUser('id') userId: number) {
    return this.adminService.getParticipationStats(userId);
  }

  @ApiBearerAuth('Authorization')
  @Get('surveys')
  @ApiOperation({ summary: 'Get all surveys for admin' })
  @ApiQuery({ name: 'lang', required: false, enum: ['ru', 'kz'] })
  @ApiOkResponse({ description: 'List of all surveys' })
  async getAllSurveys(
    @CurrentUser('id') userId: number,
    @Query('lang') lang: string = 'ru'
  ) {
    return this.adminService.getAllSurveys(userId, lang);
  }

  @ApiBearerAuth('Authorization')
  @Patch('survey/:id')
  @ApiOperation({ summary: 'Update survey status or final decision' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Survey updated successfully' })
  async updateSurvey(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AdminUpdateSurveyDto,
  ) {
    return this.adminService.updateSurvey(id, body, userId);
  }

  @ApiBearerAuth('Authorization')
  @Delete('survey/:id')
  @ApiOperation({ summary: 'Delete survey' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Survey deleted successfully' })
  async deleteSurvey(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminService.deleteSurvey(id, userId);
  }

  @ApiBearerAuth('Authorization')
  @Get('stats')
  @ApiOperation({ summary: 'Get admin statistics' })
  @ApiOkResponse({ description: 'Admin statistics' })
  async getStats(@CurrentUser('id') userId: number) {
    return this.adminService.getStats(userId);
  }
}
