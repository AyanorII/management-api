import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true, // <--- Important. With this option enabled, req will be passed as the first argument to the verify callback.
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    const { email } = payload;

    const user = await this.usersService.findOne({ email });

    const matches = await this.authService.checkHashMatches(
      refreshToken,
      user.refreshToken,
    );

    if (!matches) {
      throw new UnauthorizedException();
    }

    delete user.password;
    return user;
  }
}
