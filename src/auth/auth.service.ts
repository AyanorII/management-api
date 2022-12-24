import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ONE_MINUTE, ONE_WEEK } from '../constants';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Tokens } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<Tokens> {
    const user = await this.usersService.create(signUpDto);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findOne(loginDto.email);
    await this.checkPasswordsMatch(loginDto.password, user.password);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: ONE_MINUTE * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: ONE_WEEK,
        },
      ),
    ]);

    return { access_token, refresh_token };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.usersService.update(userId, { refreshToken: hash });
  }

  async checkPasswordsMatch(password: string, hashedPassword: string) {
    const passwordMatches = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  hashData(data: string, salt = 10) {
    return bcrypt.hash(data, salt);
  }
}
