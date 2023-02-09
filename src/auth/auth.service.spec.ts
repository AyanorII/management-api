import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithoutPassword } from '../users/interfaces';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { loginStubDto, signUpStubDto, userStub } from './auth.stub';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './interfaces';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let tokens: Tokens;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, PrismaService],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jwtService.signAsync = jest.fn().mockResolvedValue('token');
  });

  afterAll(async () => {
    await prisma.cleanDatabase();
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('sign-up', () => {
    it('should return an access token and a refresh token', async () => {
      tokens = await authService.signUp(signUpStubDto);

      expect(tokens).toEqual(
        expect.objectContaining({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        }),
      );
    });

    it('should not create a user if email is already in database', async () => {
      await expect(authService.signUp(signUpStubDto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should return an access token and a refresh token', async () => {
      tokens = await authService.login(loginStubDto);

      expect(tokens).toEqual(
        expect.objectContaining({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        }),
      );
    });

    it('should throw an unauthorized exception if user is not in the database', async () => {
      const nonExistingUser: LoginDto = {
        email: '',
        password: '',
      };

      await expect(authService.login(nonExistingUser)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('updateRefreshToken', () => {
    it('should store the hashed refresh token in the database', async () => {
      let user = (await usersService.findOneByEmail(
        signUpStubDto.email,
      )) as UserWithoutPassword;

      const oldRefreshToken = user.refreshToken;

      const tokens = await authService.getTokens(user);

      user = await authService.updateRefreshToken(
        user.id,
        tokens.refresh_token,
      );

      expect(user.refreshToken).not.toBe(null);
      expect(user.refreshToken).not.toEqual(oldRefreshToken);
      expect(user.refreshToken).not.toEqual(tokens.refresh_token);
    });
  });

  describe('getTokens', () => {
    it('should return a pair of access and refresh tokens', async () => {
      tokens = await authService.getTokens(userStub);

      expect(tokens).toHaveProperty('access_token');
      expect(tokens).toHaveProperty('refresh_token');
    });
  });
});
