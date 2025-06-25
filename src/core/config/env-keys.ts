import type { AppConfig } from './app.config';
import type { JwtConfig } from '../jwt/jwt.config';

export interface EnvKeys {
  app: AppConfig;
  jwt: JwtConfig;
}

export const envKeys: { [K in keyof EnvKeys]: K } = {
  app: 'app',
  jwt: 'jwt',
};
