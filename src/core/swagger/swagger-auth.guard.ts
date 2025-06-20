import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ClientErrorMessages, ErrorCodes, ServerErrorMessages } from 'src/shared/constant/message';
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
            field: 'x-app-token',
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
