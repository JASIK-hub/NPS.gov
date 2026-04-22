import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RegionCodes } from 'src/modules/survey/enums/region.enum';

@Entity('region')
export class RegionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'ALM', enum: RegionCodes })
  @Column({ type: 'enum', enum: RegionCodes })
  code: RegionCodes;
}
