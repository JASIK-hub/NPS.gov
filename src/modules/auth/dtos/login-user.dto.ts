import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginEmailDto {
  @ApiProperty({ default: 'example@gmail.com или ИИН' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  identifier: string;
}

export class LoginPasswordDto extends LoginEmailDto{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  password:string
}
