import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { SurveyEntity } from './survey.entity';

@Entity('organization')
export class OrganizationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Column({ unique: true, length: 12 })
  bin: string;

  @ApiProperty()
  @Column({ nullable: true })
  name: string;

  @ApiProperty()
  @OneToMany(() => UserEntity, (user) => user.organization)
  users: UserEntity[];

  @ApiProperty()
  @OneToMany(() => SurveyEntity, (survey) => survey.organization)
  survey: SurveyEntity[];
}
