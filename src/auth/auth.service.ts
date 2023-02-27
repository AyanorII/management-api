import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserDocument } from '../users/schemas/user.schema';
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
    signUpDto.password = await this.hashData(signUpDto.password);

    const user = await this.usersService.create(signUpDto);
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { email, password } = loginDto;

    const user = await this.authenticateUser({ email, password });
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(id: string): Promise<void> {
    await this.usersService.removeRefreshToken(id);
  }

  async refreshToken(user: UserDocument): Promise<Tokens> {
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async getTokens(user: UserDocument): Promise<Tokens> {
    const { id, email, name } = user;

    const accessTokenData = {
      payload: {
        sub: id,
        email,
        company: 'Company',
        name,
      },
      options: {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '5min',
      },
    };

    const refreshTokenData = {
      payload: {
        sessionId: uuidv4(),
        email,
      },
      options: {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        accessTokenData.payload,
        accessTokenData.options,
      ),
      this.jwtService.signAsync(
        refreshTokenData.payload,
        refreshTokenData.options,
      ),
    ]);

    return { access_token, refresh_token };
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserDocument> {
    const hash = await this.hashData(refreshToken);

    return this.usersService.update(userId, { refreshToken: hash });
  }

  async authenticateUser({
    email,
    password,
  }: Pick<LoginDto, 'email' | 'password'>): Promise<UserDocument> {
    const user = await this.usersService.findOne({ email });
    const passwordMatches = await this.checkHashMatches(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async checkHashMatches(
    data: string,
    encryptedData: string,
  ): Promise<boolean> {
    return bcrypt.compare(data, encryptedData);
  }

  async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }
}
