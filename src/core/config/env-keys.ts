import type { AppConfig } from './app.config';

export interface EnvKeys {
  app: AppConfig;
}

export const envKeys: { [K in keyof EnvKeys]: K } = {
  app: 'app',
};
