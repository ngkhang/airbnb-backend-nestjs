import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { envKeys } from './core/config/env-keys';
import { setupSwagger } from './core/swagger/setup.swagger';

import type { EnvConfig } from './core/config/env-keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { protocol, host, port, basePath, version, swaggerResource } = app
    .get(ConfigService<EnvConfig>)
    .getOrThrow(envKeys.app, { infer: true });

  const baseUrl = `${protocol}://${port ? `${host}/${port}` : host}`;
  const apiVersionPath = `${basePath}/v${version}`;

  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: `${version}`,
      prefix: 'v',
    })
    .setGlobalPrefix(basePath);

  setupSwagger(app);

  await app.listen(port);

  Logger.log(`
    - Server: ${baseUrl}/${apiVersionPath}
    - API docs: ${baseUrl}/${apiVersionPath}/${swaggerResource}`);
}

void bootstrap();
