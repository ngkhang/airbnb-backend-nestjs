import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CLIENT_MESSAGES } from 'src/shared/constant/client-message';
import { ErrorCodes } from 'src/shared/constant/errorCodes';
import { DetailedHttpException } from 'src/shared/filter/detailed-http.exception';

import { EnvConfig, envKeys } from '../config/env-keys';
import { APP_TOKEN, SWAGGER_STRATEGY_KEY } from '../jwt/jwt.const';
import { JwtPayload, SwaggerJwtPayload } from '../jwt/jwt.type';

@Injectable()
export class SwaggerJwtStrategy extends PassportStrategy(Strategy, SWAGGER_STRATEGY_KEY) {
  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const { jwtIssuer, jwtSwaggerSecretKey } = configService.getOrThrow(envKeys.jwt, { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromHeader(APP_TOKEN),
      ignoreExpiration: false,
      secretOrKey: jwtSwaggerSecretKey,
      issuer: jwtIssuer,
    });
  }

  validate(payload: JwtPayload & Partial<SwaggerJwtPayload>): JwtPayload & SwaggerJwtPayload {
    if (!payload.sub) {
      throw new DetailedHttpException(
        {
          message: CLIENT_MESSAGES.ERROR.AUTH_TOKEN_INCORRECT,
          errors: [
            {
              code: ErrorCodes.AUTH_JWT_TOKEN_INVALID,
              message: 'The payload of x-app-token is missing sub field',
            },
          ],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      iss: payload.iss,
      iat: payload.iat,
      exp: payload.exp,
      sub: payload.sub,
    };
  }
}
