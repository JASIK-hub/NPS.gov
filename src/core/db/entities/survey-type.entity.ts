import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SurveyEntity } from './survey.entity';

@Entity('survey_type')
export class SurveyTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', unique: true })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  nameKz: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  nameRu: string;

  @ApiProperty()
  @OneToMany(() => SurveyEntity, (survey) => survey.type)
  surveys: SurveyEntity[];
}
