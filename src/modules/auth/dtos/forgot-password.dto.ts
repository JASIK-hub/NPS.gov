import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}
