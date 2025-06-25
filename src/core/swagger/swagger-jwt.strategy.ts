import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { envKeys, EnvKeys } from '../config/env-keys';
import { APP_TOKEN_KEY, SWAGGER_PASSPORT_NAME } from '../jwt/jwt.const';
import { JwtPayloadData, SwaggerJwtPayloadData, SwaggerJwtValidated } from '../jwt/jwt.type';

@Injectable()
export class SwaggerJwtStrategy extends PassportStrategy(Strategy, SWAGGER_PASSPORT_NAME) {
  constructor(private readonly configService: ConfigService<EnvKeys>) {
    const { jwtSwaggerSecretKey } = configService.getOrThrow(envKeys.jwt, { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromHeader(APP_TOKEN_KEY),
      ignoreExpiration: false,
      secretOrKey: jwtSwaggerSecretKey,
    });
  }

  validate(payload: JwtPayloadData & Partial<SwaggerJwtPayloadData>): SwaggerJwtValidated {
    if (!payload.sub) {
      throw new UnauthorizedException('Missing or invalid subject in token');
    }

    return new SwaggerJwtValidated({
      ...payload,
      sub: payload.sub,
    });
  }
}
