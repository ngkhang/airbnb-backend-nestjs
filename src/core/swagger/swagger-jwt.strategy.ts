import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ServerErrorCode } from 'src/shared/constant/errorCode';
import { ClientErrorMessage, ServerErrorMessage } from 'src/shared/constant/message';

import { envKeys, EnvKeys } from '../config/env-keys';
import { ErrorDetailException } from '../filters/error-detail.exception';
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
      throw new ErrorDetailException(
        {
          message: ClientErrorMessage.AUTH_TOKEN_FORMAT_INVALID,
          errors: [
            {
              code: ServerErrorCode.AUTH_TOKEN_FORMAT_INVALID,
              message: ServerErrorMessage.AUTH_TOKEN_FORMAT_INVALID,
              field: APP_TOKEN_KEY,
            },
          ],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return new SwaggerJwtValidated({
      ...payload,
      sub: payload.sub,
    });
  }
}
