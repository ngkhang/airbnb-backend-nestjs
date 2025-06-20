import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import ms from 'ms';

import { validateEnv } from 'src/shared/validation/env-validation';

import { envKeys } from '../config/env-keys';

export interface JwtConfig {
  jwtIssuer: string;
  jwtSwaggerSecretKey: string;
  jwtSwaggerExpiresIn: string;
  jwtAuthSecretKey: string;
  jwtAuthExpiresIn: string;
}

class EnvVariables {
  @IsNotEmpty()
  @IsString()
  JWT_ISSUER: string;

  @IsNotEmpty()
  @IsString()
  JWT_SWAGGER_SECRET_KEY: string;

  @IsNotEmpty()
  @IsString()
  JWT_SWAGGER_EXPIRES_IN: ms.StringValue;

  @IsString()
  @IsNotEmpty()
  JWT_AUTH_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  JWT_AUTH_EXPIRES_IN: ms.StringValue;
}

export default registerAs(envKeys.jwt, (): JwtConfig => {
  const validated = validateEnv(process.env, EnvVariables);

  return {
    jwtIssuer: validated.JWT_ISSUER,
    jwtSwaggerSecretKey: validated.JWT_SWAGGER_SECRET_KEY,
    jwtSwaggerExpiresIn: validated.JWT_SWAGGER_EXPIRES_IN,
    jwtAuthSecretKey: validated.JWT_AUTH_SECRET_KEY,
    jwtAuthExpiresIn: validated.JWT_AUTH_EXPIRES_IN,
  };
});
