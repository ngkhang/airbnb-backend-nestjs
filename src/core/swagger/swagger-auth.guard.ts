import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ErrorCodes } from 'src/shared/constant/errorCodes';
import { DetailedHttpException } from 'src/shared/filter/detailed-http.exception';
import { ApiErrorDetail } from 'src/shared/types/response.type';

import { SWAGGER_STRATEGY_KEY } from '../jwt/jwt.const';

@Injectable()
export class SwaggerAuthGuard extends AuthGuard(SWAGGER_STRATEGY_KEY) {
  constructor() {
    super();
  }

  handleRequest<TUser>(err: any, user: TUser, info: any): TUser {
    if (err) {
      throw err;
    }

    if (info instanceof Error) {
      const message = 'UnAuthorization';
      const error: ApiErrorDetail = {
        code: ErrorCodes.AUTH_JWT_TOKEN_INVALID,
        message: 'The x-app-token invalid',
      };
      if (JSON.stringify(info) === '{}') {
        error.code = ErrorCodes.AUTH_JWT_TOKEN_NOT_FOUND;
        error.message = 'The x-app-token not found';
      } else if (info.name === 'TokenExpiredError') {
        error.code = ErrorCodes.AUTH_JWT_TOKEN_EXPIRED;
        error.message = 'The x-app-token has expired';
      } else if (info.name === 'JsonWebTokenError') {
        error.code = ErrorCodes.AUTH_JWT_TOKEN_INCORRECT;

        switch (info.message) {
          case 'invalid signature':
            error.message = 'The secret key of x-app-token incorrect';
            break;

          case 'invalid token':
            error.message = 'The header or payload could not be parsed';
            break;

          case `jwt issuer invalid. expected: airbnb-backend-nestjs`:
            error.message = 'The issuer of x-app-token incorrect';
            break;

          default:
            break;
        }
      }

      throw new DetailedHttpException(
        {
          message,
          errors: [error],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
