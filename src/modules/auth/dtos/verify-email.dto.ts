import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;
}

export class VerifyEmailWithPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'newPassword123', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
