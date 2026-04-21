import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsEnum, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MinLength, 
  Matches, 
  IsPhoneNumber
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserGender } from 'src/modules/user/enums/user-gender.enum';

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  firstName: string;

  @ApiProperty({ description: 'Дата рождения в формате DD.MM.YY' })
  @IsNotEmpty()
  @IsString()
  birthday: string;

  @ApiProperty({ enum: UserGender})
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('KZ')
  phone: string;

  @ApiProperty({ example: 'example@gmail.com', required: false })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}