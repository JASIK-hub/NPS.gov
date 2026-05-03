import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class LoginEcpDto {
  @ApiProperty({ description: 'Подписанная строка от NCALayer' })
  @IsString()
  @IsNotEmpty()
  cms: string;

  @IsString()
  @IsNotEmpty()
  data: string;
}
