import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../constants';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;
}
