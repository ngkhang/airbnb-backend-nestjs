import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ClientErrorMessages, ErrorCodes, ServerErrorMessages } from 'src/shared/constant/message';
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
          message: ClientErrorMessages.TOKEN_INCORRECT,
          errors: [
            {
              code: ErrorCodes.TOKEN_INVALID,
              message: ServerErrorMessages.TOKEN_INVALID,
              field: 'sub',
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
