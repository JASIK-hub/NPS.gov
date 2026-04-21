import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class LoginEcpDto {
  @ApiProperty({ description: 'Подписанная строка от NCALayer' })
  @IsString()
  @IsNotEmpty()
  cms: string;

  @ApiProperty({ description: 'БИН организации (для админов)', required: false })
  @IsOptional()
  @IsString()
  @Length(12, 12)
  bin: string;
}