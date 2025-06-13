import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { envKeys } from '../config/env-keys';
import { APP_TOKEN } from '../jwt/jwt.const';

import type { EnvConfig } from '../config/env-keys';

export const setupSwagger = (app: INestApplication): void => {
  const { version, swaggerResource } = app.get(ConfigService<EnvConfig>).getOrThrow(envKeys.app, { infer: true });

  const config = new DocumentBuilder()
    .setTitle('Airbnb API')
    .setDescription(
      'REST API for an Airbnb-like platform that enables users to list, discover, and book unique accommodations around the world.',
    )
    .addBearerAuth(
      {
        type: 'apiKey',
        in: 'header',
        name: APP_TOKEN,
        description: 'Application token is required for all endpoints',
      },
      APP_TOKEN,
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
