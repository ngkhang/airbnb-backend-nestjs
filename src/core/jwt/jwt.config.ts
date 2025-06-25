import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

import { validationEnv } from 'src/shared/validation/env.validation';

import { envKeys } from '../config/env-keys';

import type ms from 'ms';

export interface JwtConfig {
  jwtIssuer: string;
  jwtSwaggerSecretKey: string;
  jwtSwaggerExpiresIn: ms.StringValue;
}

class EnvVariables {
  @IsString()
  @IsNotEmpty()
  JWT_ISSUER: string;

  @IsString()
  @IsNotEmpty()
  JWT_SWAGGER_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  JWT_SWAGGER_EXPIRES_IN: ms.StringValue;
}

export default registerAs(envKeys.jwt, (): JwtConfig => {
  const validated = validationEnv(process.env, EnvVariables);

  return {
    jwtIssuer: validated.JWT_ISSUER,
    jwtSwaggerSecretKey: validated.JWT_SWAGGER_SECRET_KEY,
    jwtSwaggerExpiresIn: validated.JWT_SWAGGER_EXPIRES_IN,
  };
});
