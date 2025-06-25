import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SWAGGER_PASSPORT_NAME } from '../jwt/jwt.const';

@Injectable()
export class SwaggerAuthGuard extends AuthGuard(SWAGGER_PASSPORT_NAME) {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (err) throw err;

    if (user) return user;

    const errors = this.mapJwtErrorToApiError(info);

    throw new UnauthorizedException({
      message: errors.message,
      code: errors.code,
    });
  }

  private mapJwtErrorToApiError(info: unknown) {
    if (!info || (typeof info === 'object' && Object.keys(info).length === 0)) {
      return {
        message: 'Not found token',
        code: 'NOT_FOUND_TOKEN',
      };
    }

    if (typeof info === 'object' && 'name' in info) {
      switch (info.name) {
        case 'TokenExpiredError':
          return {
            message: 'Token expired',
            code: 'TOKEN_EXPIRED',
          };
        case 'JsonWebTokenError':
        case 'NotBeforeError':
          return {
            message: 'Token incorrect',
            code: 'TOKEN_INCORRECT',
          };
      }
    }

    return {
      message: 'InValid token',
      code: 'INVALID_TOKEN',
    };
  }
}
