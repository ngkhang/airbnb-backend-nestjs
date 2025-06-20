import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EnvConfig, envKeys } from 'src/core/config/env-keys';
import { AUTH_STRATEGY_KEY } from 'src/core/jwt/jwt.const';
import { AuthJwtPayload, JwtPayload } from 'src/core/jwt/jwt.type';
import { ClientErrorMessages, ErrorCodes, ServerErrorMessages } from 'src/shared/constant/message';
import { DetailedHttpException } from 'src/shared/filter/detailed-http.exception';
import { ApiErrorDetail } from 'src/shared/types/response.type';
import { UsersServicePort } from 'src/v1/users/domain/ports/user-service.port';
import { USERS_SERVICE } from 'src/v1/users/users-di.token';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, AUTH_STRATEGY_KEY) {
  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    @Inject(USERS_SERVICE) private readonly userService: UsersServicePort,
  ) {
    const { jwtIssuer, jwtAuthSecretKey } = configService.getOrThrow(envKeys.jwt, { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtAuthSecretKey,
      issuer: jwtIssuer,
    });
  }

  async validate(payload: JwtPayload & Partial<AuthJwtPayload>): Promise<JwtPayload & AuthJwtPayload> {
    const message = ClientErrorMessages.TOKEN_INCORRECT;
    const errorDetail: ApiErrorDetail = {
      code: ErrorCodes.TOKEN_INVALID,
      message: ServerErrorMessages.TOKEN_INVALID,
    };

    if (!payload.userId || !payload.role) {
      throw new DetailedHttpException(
        {
          message,
          errors: {
            ...errorDetail,
            field: !payload.userId ? 'userId' : 'role',
          },
        },

        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.getUserById(payload.userId);

    if (!user.success) {
      throw new DetailedHttpException(
        {
          message,
          errors: {
            ...errorDetail,
            field: 'userId',
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.data.role !== payload.role) {
      throw new DetailedHttpException(
        {
          message,
          errors: {
            ...errorDetail,
            field: 'role',
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      iss: payload.iss,
      iat: payload.iat,
      exp: payload.exp,
      userId: user.data.id,
      role: user.data.role,
    };
  }
}
