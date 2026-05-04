import { Module } from '@nestjs/common';
import { SurveyModule } from '../survey/survey.module';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SurveyModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
