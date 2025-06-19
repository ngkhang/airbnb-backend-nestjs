import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { AUTH_STRATEGY_KEY } from 'src/core/jwt/jwt.const';
import { CLIENT_MESSAGES } from 'src/shared/constant/client-message';
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
      let message = CLIENT_MESSAGES.ERROR.AUTH_TOKEN_INVALID;
      const errorDetail: ApiErrorDetail = {
        code: ErrorCodes.AUTH_JWT_TOKEN_INVALID,
        message: 'The access token invalid',
      };

      if (JSON.stringify(info) === '{}') {
        message = CLIENT_MESSAGES.ERROR.AUTH_TOKEN_MISSING;
        errorDetail.code = ErrorCodes.AUTH_JWT_TOKEN_NOT_FOUND;
        errorDetail.message = 'The access token is require';
      } else if (info.name === 'TokenExpiredError') {
        message = CLIENT_MESSAGES.ERROR.AUTH_TOKEN_EXPIRED;
        errorDetail.code = ErrorCodes.AUTH_JWT_TOKEN_EXPIRED;
        errorDetail.message = 'The access token has expired';
      } else if (info.name === 'JsonWebTokenError') {
        message = CLIENT_MESSAGES.ERROR.AUTH_TOKEN_INCORRECT;
        errorDetail.code = ErrorCodes.AUTH_JWT_TOKEN_INCORRECT;

        switch (info.message) {
          case 'invalid signature':
            errorDetail.message = 'The access token signature is invalid';
            break;

          case 'invalid token':
            errorDetail.message = 'The access token is malformed';
            break;

          case `jwt issuer invalid. expected: airbnb-backend-nestjs`:
            errorDetail.message = 'The access token issuer is invalid';
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
