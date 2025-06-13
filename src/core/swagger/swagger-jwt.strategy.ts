import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EnvConfig, envKeys } from '../config/env-keys';
import { APP_TOKEN, SWAGGER_STRATEGY_KEY } from '../jwt/jwt.const';

interface SwaggerJwtPayload {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
}

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

  validate(payload: SwaggerJwtPayload): SwaggerJwtPayload {
    return payload;
  }
}
