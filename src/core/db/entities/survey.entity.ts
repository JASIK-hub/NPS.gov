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
import { SurveyType } from 'src/modules/survey/enums/survey-type.enum';

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

  @ApiProperty({ enum: SurveyType })
  @Column({ type: 'enum', enum: SurveyType })
  type: SurveyType;

  @ApiPropertyOptional({ type: () => RegionEntity })
  @ManyToOne(() => RegionEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity | null;

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
