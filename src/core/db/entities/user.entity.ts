import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserGender } from 'src/modules/user/enums/user-gender.enum';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { SurveyEntity } from './survey.entity';
import { VoteEntity } from './vote.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Expose({ groups: ['profile'] })
  @ApiProperty({ description: 'ИИН или БИН' })
  @Column({ type: 'varchar', length: 12, unique: true, nullable: true })
  iin?: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  firstName?: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  lastName?: string;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', nullable: true })
  middleName?: string;

  @ApiProperty()
  @ManyToOne(() => OrganizationEntity, (org) => org.users, { nullable: true })
  @JoinColumn({ name: 'organization_id' })
  organization?: OrganizationEntity;

  @ApiProperty()
  @OneToMany(() => VoteEntity, (vote) => vote.user)
  vote: VoteEntity[];

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @ApiProperty()
  @Column({ type: 'enum', enum: UserGender, nullable: true })
  gender: UserGender | null;

  @ApiPropertyOptional()
  @Exclude()
  @Column({ type: 'text', nullable: true })
  password?: string;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', nullable: true, unique: true })
  phone?: string;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiProperty({ enum: UserRoles })
  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role?: UserRoles;
}
