import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { RegionEntity } from './region.entity';

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
  @ManyToOne(() => OrganizationEntity, (org) => org.survey)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @ApiPropertyOptional({ type: () => RegionEntity })
  @ManyToOne(() => RegionEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity | null;

  @ApiProperty({})
  @Column({ type: 'integer', default: 0 })
  votedCount: number;

  @ApiProperty()
  @Column({ type: 'date' })
  validUntil: Date;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  status: boolean;
}
