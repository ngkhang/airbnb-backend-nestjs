import type { AppConfig } from './app.config';

export interface EnvConfig {
  app: AppConfig;
}

export const envKeys: { [K in keyof EnvConfig]: K } = {
  app: 'app',
};
