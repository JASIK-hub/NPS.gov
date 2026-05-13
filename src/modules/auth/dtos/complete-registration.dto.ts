import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserGender } from 'src/modules/user/enums/user-gender.enum';

export class CompleteRegistrationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  birthday: string;

  @ApiProperty({ enum: UserGender })
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  @Transform(({ value }) => value.trim())
  emailCode: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ecpSignature?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ecpData?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  iin?: string;
}
