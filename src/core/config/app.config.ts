import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

import { validateEnv } from 'src/utils/env-validation';

import { envKeys } from './env-keys';

export interface AppConfig {
  nodeEnv: string;
  appName: string;
  protocol: string;
  host: string;
  port: number;
  basePath: string;
  version: number;
}

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

enum AppProtocol {
  HTTP = 'http',
  HTTPS = 'https',
}

class EnvVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsString()
  @IsEnum(AppProtocol)
  APP_PROTOCOL: AppProtocol;

  @IsString()
  @IsNotEmpty()
  APP_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  APP_PORT: number;

  @IsString()
  APP_BASE_PATH: string;

  @IsNotEmpty()
  @Min(1)
  @IsInt()
  APP_VERSION: number;
}

export default registerAs(envKeys.app, (): AppConfig => {
  const validated = validateEnv(process.env, EnvVariables);

  return {
    nodeEnv: validated.NODE_ENV,
    appName: validated.APP_NAME,
    protocol: validated.APP_PROTOCOL,
    host: validated.APP_HOST,
    port: validated.APP_PORT,
    basePath: validated.APP_BASE_PATH,
    version: validated.APP_VERSION,
  };
});
