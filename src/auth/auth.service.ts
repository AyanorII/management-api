import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ONE_MINUTE, ONE_WEEK } from '../constants';
import { UserWithoutPassword } from '../users/interfaces';
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
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    await this.checkHashMatches(loginDto.password, user.password);
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(id: number): Promise<void> {
    await this.usersService.update(id, { refreshToken: null });
  }

  async refreshToken(id: number, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findOneById(id);
    await this.checkHashMatches(refreshToken, user.refreshToken);
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async getTokens(user: UserWithoutPassword): Promise<Tokens> {
    const { id, email, name, companyName: company } = user;

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
          company,
          name,
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: ONE_MINUTE * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
          company,
          name,
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

  async checkHashMatches(data: string, encryptedData: string) {
    const hashMatches = await bcrypt.compare(data, encryptedData);

    if (!hashMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  hashData(data: string, salt = 10) {
    return bcrypt.hash(data, salt);
  }
}
