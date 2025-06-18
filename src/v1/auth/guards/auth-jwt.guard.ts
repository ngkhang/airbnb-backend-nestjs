import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { AUTH_STRATEGY_KEY } from 'src/core/jwt/jwt.const';
import { ErrorCodes } from 'src/shared/constant/errorCodes';
import { IS_SKIP_AUTH_KEY } from 'src/shared/decorators/skip-auth.decorator';
import { DetailedHttpException } from 'src/shared/filter/detailed-http.exception';
import { ApiErrorDetail } from 'src/shared/types/response.type';

@Injectable()
export class AuthJwtGuard extends AuthGuard(AUTH_STRATEGY_KEY) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isSkipAuth = this.reflector.getAllAndOverride<boolean>(IS_SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isSkipAuth ? true : super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (err) throw err;

    if (info instanceof Error) {
      const message = 'UnAuthorization';
      const errorDetail: ApiErrorDetail = {
        code: ErrorCodes.AUTH_JWT_TOKEN_INVALID,
        message: 'The access token invalid',
      };

      if (JSON.stringify(info) === '{}') {
        errorDetail.code = ErrorCodes.AUTH_JWT_TOKEN_NOT_FOUND;
        errorDetail.message = 'The access token is require';
      } else if (info.name === 'TokenExpiredError') {
        errorDetail.code = ErrorCodes.AUTH_JWT_TOKEN_EXPIRED;
        errorDetail.message = 'The access token has expired';
      } else if (info.name === 'JsonWebTokenError') {
        errorDetail.code = ErrorCodes.AUTH_JWT_TOKEN_INCORRECT;

        switch (info.message) {
          case 'invalid signature':
            errorDetail.message = 'The secret key of access token incorrect';
            break;

          case 'invalid token':
            errorDetail.message = 'The header or payload could not be parsed';
            break;

          case `jwt issuer invalid. expected: airbnb-backend-nestjs`:
            errorDetail.message = 'The issuer of access token incorrect';
            break;

          default:
            break;
        }
      }

      throw new DetailedHttpException(
        {
          message,
          errors: [errorDetail],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
