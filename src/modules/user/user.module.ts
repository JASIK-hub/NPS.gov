import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { OrganizationService } from './services/organization.service';
import { OrganizationEntity } from 'src/core/db/entities/organization.entity';
import { SurveyModule } from '../survey/survey.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OrganizationEntity]),
    forwardRef(() => SurveyModule),
  ],
  controllers: [UserController],
  providers: [UserService, OrganizationService],
  exports: [UserService, OrganizationService],
})
export class UserModule {}
