import { Matches } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { EMAIL_REGEX } from 'src/constants';
export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsDateString()
  startedAt?: string;

  @ApiProperty()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  @Matches(EMAIL_REGEX)
  email?: string;

  @ApiProperty()
  @IsNumber()
  salary: number;
}
