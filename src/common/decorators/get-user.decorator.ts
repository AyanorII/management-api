import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces';

export const GetUser = createParamDecorator(
  (_data, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
