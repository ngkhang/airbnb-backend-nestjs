import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CLIENT_MESSAGES } from 'src/shared/constant/client-message';
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
    if (err) throw err;

    if (info instanceof Error) {
      let message = CLIENT_MESSAGES.ERROR.AUTH_TOKEN_INVALID;
      const errorDetail: ApiErrorDetail = {
        code: ErrorCodes.AUTH_JWT_TOKEN_INVALID,
        message: 'The x-app-token invalid',
      };

      if (JSON.stringify(info) === '{}') {
        message = CLIENT_MESSAGES.ERROR.AUTH_TOKEN_MISSING;
        errorDetail.code = ErrorCodes.AUTH_JWT_TOKEN_NOT_FOUND;
        errorDetail.message = 'The x-app-token is require';
      } else if (info.name === 'TokenExpiredError') {
        message = CLIENT_MESSAGES.ERROR.AUTH_TOKEN_EXPIRED;
        errorDetail.code = ErrorCodes.AUTH_JWT_TOKEN_EXPIRED;
        errorDetail.message = 'The x-app-token has expired';
      } else if (info.name === 'JsonWebTokenError') {
        message = CLIENT_MESSAGES.ERROR.AUTH_TOKEN_INCORRECT;
        errorDetail.code = ErrorCodes.AUTH_JWT_TOKEN_INCORRECT;

        switch (info.message) {
          case 'invalid signature':
            errorDetail.message = 'The x-app-token signature is invalid';
            break;

          case 'invalid token':
            errorDetail.message = 'The x-app-token is malformed';
            break;

          case `jwt issuer invalid. expected: airbnb-backend-nestjs`:
            errorDetail.message = 'The x-app-token issuer is invalid';
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
