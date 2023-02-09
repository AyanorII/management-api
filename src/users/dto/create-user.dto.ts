import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { EMAIL_REGEX } from '../../constants';

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
  @Matches(EMAIL_REGEX)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;
}
