import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { envKeys, type EnvConfig } from './core/config/env-keys';
import { setupSwagger } from './core/swagger/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appEnv = app.get(ConfigService<EnvConfig>).getOrThrow(envKeys.app, { infer: true });

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

  // Set up Swagger
  setupSwagger(app);

  await app.listen(appEnv.port);

  Logger.log(`
    - Server: ${baseUrl}/${apiVersionPath}
    - API docs: ${baseUrl}/${apiVersionPath}/${appEnv.swaggerResource}
    `);
}

void bootstrap();
