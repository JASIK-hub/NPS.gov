import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { RegionEntity } from './region.entity';
import { VoteEntity } from './vote.entity';
import { OptionEntity } from './option.entity';
import { SurveyTypeEntity } from './survey-type.entity';
import { SurveyExecutionStatus } from 'src/modules/survey/enums/survey-execution.enum';

@Entity('survey')
export class SurveyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'varchar' })
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @Column({ type: 'text' })
  subTitle: string;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', nullable: true })
  titleKz: string;

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  descriptionKz: string;

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  subTitleKz: string;

  @ApiProperty()
  @ManyToOne(() => OrganizationEntity, (org) => org.survey)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @ApiPropertyOptional()
  @OneToMany(() => VoteEntity, (vote) => vote.survey, { nullable: true })
  vote?: VoteEntity[];

  @ApiProperty()
  @OneToMany(() => OptionEntity, (option) => option.survey)
  options: OptionEntity[];

  @ApiProperty({ type: () => SurveyTypeEntity })
  @ManyToOne(() => SurveyTypeEntity, (type) => type.surveys)
  @JoinColumn({ name: 'type_id' })
  type: SurveyTypeEntity;

  @ApiPropertyOptional({ type: () => RegionEntity })
  @ManyToOne(() => RegionEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity | null;

  @ApiProperty({ enum: SurveyExecutionStatus })
  @Column({ type: 'enum', enum: SurveyExecutionStatus,default:SurveyExecutionStatus.IN_PROGRESS })
  executionStatus:SurveyExecutionStatus

  @ApiProperty()
  @Column({type:'text',nullable:true})
  finalDecision:string

  @ApiProperty()
  @Column({ type: 'integer', default: 0 })
  votedCount: number;

  @ApiProperty()
  @Column({ type: 'date' })
  startDate: string;

  @ApiProperty()
  @Column({ type: 'date' })
  validUntil: Date;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
