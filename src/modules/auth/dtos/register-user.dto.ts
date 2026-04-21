import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ default: 'example@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({ default: '1234567' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  password: string;
}
