import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AccessToken } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<AccessToken> {
    const user = await this.usersService.findOne(loginDto.email);

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (passwordMatches) {
      const payload = {
        email: user.email,
        sub: user.id,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async signUp(signUpDto: SignUpDto): Promise<AccessToken> {
    const user = await this.usersService.create(signUpDto);
    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
