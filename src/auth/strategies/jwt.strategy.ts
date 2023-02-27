import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserDocument> {
    try {
      const { email } = payload;
      const user = await this.usersService.findOne({ email });

      delete user.password;
      delete user.refreshToken;

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException();
      }
    }
  }
}
