import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/service/base.service';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { RegisterUserDto } from 'src/modules/auth/dtos/register-user.dto';
import { SurveyActiveQueryDto } from 'src/modules/survey/dto/survey-active-query.dto';
import { SurveyService } from 'src/modules/survey/services/survey.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private surveyService: SurveyService,
  ) {
    super(userRepository);
  }

  async createUser(body: RegisterUserDto) {
    const user = this.userRepository.create({
      email: body.email,
      password: body.password,
    });
    return await this.userRepository.save(user);
  }

  async getUserSurveys(userId: number, query: SurveyActiveQueryDto) {
    return await this.surveyService.getUserSurveyList(userId, query);
  }
}
