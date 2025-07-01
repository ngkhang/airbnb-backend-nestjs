import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { envKeys } from './core/config/env-keys';
import { setupSwagger } from './core/swagger/setup.swagger';
import { optionsValidation } from './shared/validation/options.validation';

import type { EnvKeys } from './core/config/env-keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appEnv = app.get(ConfigService<EnvKeys>).getOrThrow(envKeys.app, { infer: true });
  const baseUrl = `${appEnv.protocol}://${appEnv.port ? `${appEnv.host}:${appEnv.port}` : appEnv.host}`;
  const apiVersionPath = `${appEnv.basePath}/v${appEnv.version}`;

  app.useGlobalPipes(new ValidationPipe(optionsValidation));

  // Enable Version
  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: `${appEnv.version}`,
      prefix: 'v',
    })
    .setGlobalPrefix(appEnv.basePath);

  // Integrate Swagger documentation
  setupSwagger(app);

  await app.listen(appEnv.port);

  Logger.log(`
    Application is running on: ${baseUrl}/${apiVersionPath}}
    Api Documentation: ${baseUrl}/${apiVersionPath}/${appEnv.swaggerResource}
    `);
}

void bootstrap();
