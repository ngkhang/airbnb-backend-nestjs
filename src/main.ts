import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { envKeys } from './core/config/env-keys';

import type { EnvKeys } from './core/config/env-keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appEnv = app.get(ConfigService<EnvKeys>).getOrThrow(envKeys.app, { infer: true });
  const baseUrl = `${appEnv.protocol}://${appEnv.port ? `${appEnv.host}:${appEnv.port}` : appEnv.host}`;
  const apiVersionPath = `${appEnv.basePath}/v${appEnv.version}`;

  // Enable Version
  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: `${appEnv.version}`,
      prefix: 'v',
    })
    .setGlobalPrefix(appEnv.basePath);

  await app.listen(appEnv.port);

  Logger.log(`Application is running on: ${baseUrl}/${apiVersionPath}}`);
}

void bootstrap();
