import type { AppConfig } from './app.config';
import type { JwtConfig } from '../jwt/jwt.config';

export interface EnvConfig {
  app: AppConfig;
  jwt: JwtConfig;
}

export const envKeys: { [K in keyof EnvConfig]: K } = {
  app: 'app',
  jwt: 'jwt',
};
