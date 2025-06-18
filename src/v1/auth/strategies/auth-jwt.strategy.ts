import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EnvConfig, envKeys } from 'src/core/config/env-keys';
import { AUTH_STRATEGY_KEY } from 'src/core/jwt/jwt.const';
import { ErrorCodes } from 'src/shared/constant/errorCodes';
import { DetailedHttpException } from 'src/shared/filter/detailed-http.exception';
import { UsersServicePort } from 'src/v1/users/domain/ports/user-service.port';
import { USERS_SERVICE } from 'src/v1/users/users-di.token';

export interface TokenPayload {
  userId: string;
  role: string;
}

interface AuthJwtPayload extends Partial<TokenPayload> {
  iss: string;
  iat: number;
  exp: number;
}

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

  async validate(payload: AuthJwtPayload): Promise<AuthJwtPayload> {
    const { userId, role } = payload;

    if (!userId || !role) {
      throw new DetailedHttpException(
        {
          message: 'UnAuthorization',
          errors: [
            {
              code: ErrorCodes.AUTH_JWT_TOKEN_INCORRECT,
              message: 'The payload incorrect',
            },
          ],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.getUserById(userId);

    if (!user.success || user.data.role !== role) {
      throw new DetailedHttpException(
        {
          message: 'UnAuthorization',
          errors: [
            {
              code: ErrorCodes.AUTH_JWT_TOKEN_INVALID,
              message: 'The payload invalid',
            },
          ],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return payload;
  }
}
