import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ServerErrorCode } from 'src/shared/constant/errorCode';
import { ClientErrorMessage, ServerErrorMessage } from 'src/shared/constant/message';

import { ErrorDetailException } from '../filters/error-detail.exception';
import { APP_TOKEN_KEY, SWAGGER_PASSPORT_NAME } from '../jwt/jwt.const';

@Injectable()
export class SwaggerAuthGuard extends AuthGuard(SWAGGER_PASSPORT_NAME) {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (err) throw err;

    if (user) return user;

    const { message, error } = this.mapJwtErrorToApiError(info);

    throw new ErrorDetailException(
      {
        message,
        errors: [
          {
            ...error,
            field: APP_TOKEN_KEY,
          },
        ],
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  private mapJwtErrorToApiError(info: unknown) {
    if (!info || (typeof info === 'object' && Object.keys(info).length === 0)) {
      return {
        message: ClientErrorMessage.AUTH_TOKEN_MISSING,
        error: {
          message: ServerErrorMessage.AUTH_TOKEN_MISSING,
          code: ServerErrorCode.AUTH_TOKEN_MISSING,
        },
      };
    }

    if (typeof info === 'object' && 'name' in info) {
      switch (info.name) {
        case 'TokenExpiredError':
          return {
            message: ClientErrorMessage.AUTH_TOKEN_EXPIRED,
            error: {
              message: ServerErrorMessage.AUTH_TOKEN_EXPIRED,
              code: ServerErrorCode.AUTH_TOKEN_EXPIRED,
            },
          };
        case 'JsonWebTokenError':
        case 'NotBeforeError':
          return {
            message: ClientErrorMessage.AUTH_TOKEN_PAYLOAD_INVALID,
            error: {
              message: ServerErrorMessage.AUTH_TOKEN_PAYLOAD_INVALID,
              code: ServerErrorCode.AUTH_TOKEN_PAYLOAD_INVALID,
            },
          };
      }
    }

    return {
      message: ClientErrorMessage.AUTH_TOKEN_FORMAT_INVALID,
      error: {
        message: ServerErrorMessage.AUTH_TOKEN_FORMAT_INVALID,
        code: ServerErrorCode.AUTH_TOKEN_FORMAT_INVALID,
      },
    };
  }
}
