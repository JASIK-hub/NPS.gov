import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminCreateSurveyDto } from '../dto/admin-create-survey.dto';
import { AdminService } from '../services/admin.service';
import { CurrentUser } from 'src/core/decorators/user.decorator';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth('Authorization')
  @Post('survey')
  @ApiOperation({ summary: 'Create survey for admin' })
  async createSurvey(
    @CurrentUser('id') userId: number,
    @Body() body: AdminCreateSurveyDto,
  ) {
    return this.adminService.createSurvey(body, userId);
  }
}
