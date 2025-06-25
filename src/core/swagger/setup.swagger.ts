import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { envKeys } from '../config/env-keys';
import { APP_TOKEN_KEY } from '../jwt/jwt.const';

import type { EnvKeys } from '../config/env-keys';

export const setupSwagger = (app: INestApplication): void => {
  const { version, swaggerResource } = app.get(ConfigService<EnvKeys>).getOrThrow(envKeys.app, { infer: true });

  const config = new DocumentBuilder()
    .setTitle('Airbnb API')
    .setDescription(
      'REST API for an Airbnb-like platform that enables users to list, discover, and book unique accommodations around the world.',
    )
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: APP_TOKEN_KEY,
        description: 'Application token is required for all endpoints',
      },
      APP_TOKEN_KEY,
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
