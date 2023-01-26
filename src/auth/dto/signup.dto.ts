import { CreateUserDto } from '../../users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Match } from '../../users/match.decorator';

export class SignUpDto extends CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Match('password', { message: "passwords don't match" })
  passwordConfirmation: string;
}
