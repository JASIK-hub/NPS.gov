import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  firstName?: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  lastName?: string;

  @ApiPropertyOptional()
  @Exclude()
  @Column({ type: 'text' })
  password: string;

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
