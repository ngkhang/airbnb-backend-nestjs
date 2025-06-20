import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { AUTH_STRATEGY_KEY } from 'src/core/jwt/jwt.const';
import { ClientErrorMessages, ErrorCodes, ServerErrorMessages } from 'src/shared/constant/message';
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
      let message = ClientErrorMessages.TOKEN_INVALID;
      const errorDetail: ApiErrorDetail = {
        code: ErrorCodes.TOKEN_INVALID,
        message: ServerErrorMessages.TOKEN_INVALID,
      };

      if (JSON.stringify(info) === '{}') {
        message = ClientErrorMessages.TOKEN_NOT_FOUND;
        errorDetail.code = ErrorCodes.TOKEN_NOT_FOUND;
        errorDetail.message = ServerErrorMessages.TOKEN_NOT_FOUND;
      } else if (info.name === 'TokenExpiredError') {
        message = ClientErrorMessages.TOKEN_EXPIRED;
        errorDetail.code = ErrorCodes.TOKEN_EXPIRED;
        errorDetail.message = ServerErrorMessages.TOKEN_EXPIRED;
      } else if (info.name === 'JsonWebTokenError') {
        message = ClientErrorMessages.TOKEN_INCORRECT;
        errorDetail.code = ErrorCodes.TOKEN_INCORRECT;
        errorDetail.message = ServerErrorMessages.TOKEN_INCORRECT;
      }

      throw new DetailedHttpException(
        {
          message,
          errors: {
            ...errorDetail,
            field: 'access_token',
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
