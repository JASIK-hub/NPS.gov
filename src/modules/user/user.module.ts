import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { OrganizationService } from './services/organization.service';
import { OrganizationEntity } from 'src/core/db/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,OrganizationEntity])],
  controllers: [UserController],
  providers: [UserService,OrganizationService],
  exports: [UserService,OrganizationService],
})
export class UserModule {}
