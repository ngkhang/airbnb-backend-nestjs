import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { envKeys } from '../config/env-keys';

import type { EnvKeys } from '../config/env-keys';

export const setupSwagger = (app: INestApplication): void => {
  const { version, swaggerResource } = app.get(ConfigService<EnvKeys>).getOrThrow(envKeys.app, { infer: true });

  const config = new DocumentBuilder()
    .setTitle('Airbnb API')
    .setDescription(
      'REST API for an Airbnb-like platform that enables users to list, discover, and book unique accommodations around the world.',
    )
    .setVersion(`${version}`)
    .build();

  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`v${version}/${swaggerResource}`, app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    useGlobalPrefix: true,
    customSiteTitle: 'Airbnb Documentation',
  });
};
