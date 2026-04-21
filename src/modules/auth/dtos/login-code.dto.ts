import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginCodeDto {
  @ApiProperty({ default: '1234' })
  @IsString()
  @Length(0, 4)
  @IsNotEmpty()
  code: string;

  @ApiProperty({ default: 'example@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  email: string;
}
