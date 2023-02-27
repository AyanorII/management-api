import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtGuard, RefreshTokenGuard } from '../common/guards';
import { UserDocument } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Tokens } from './interfaces';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@GetUser() user: UserDocument): Promise<void> {
    return this.authService.logout(user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refreshToken(@GetUser() user: UserDocument): Promise<Tokens> {
    return this.authService.refreshToken(user);
  }
}
