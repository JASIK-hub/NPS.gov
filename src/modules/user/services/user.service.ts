import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/service/base.service';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { RegisterUserDto } from 'src/modules/auth/dtos/register-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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

  async createUserWithEcp(){}
}
