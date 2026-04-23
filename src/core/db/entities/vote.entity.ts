import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { SurveyEntity } from './survey.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OptionEntity } from './option.entity';

@Entity('vote')
export class VoteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.vote)
  user: UserEntity;

  @ApiProperty()
  @ManyToOne(() => SurveyEntity, (survey) => survey.vote)
  survey: SurveyEntity;

  @ApiProperty()
  @ManyToOne(() => OptionEntity, (option) => option.votes)
  option: OptionEntity;
}
