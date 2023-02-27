import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
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
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsNumber()
  salary: number;
}
