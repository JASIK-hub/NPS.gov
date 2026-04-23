import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VoteEntity } from './vote.entity';
import { SurveyEntity } from './survey.entity';

@Entity('option')
export class OptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  title: string;

  @ApiProperty()
  @ManyToOne(() => SurveyEntity, (survey) => survey.options)
  survey: SurveyEntity;

  @ApiProperty()
  @OneToMany(() => VoteEntity, (vote) => vote.option)
  votes: VoteEntity[];
}
