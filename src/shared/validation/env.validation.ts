import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import type { ClassConstructor } from 'class-transformer';

export const validationEnv = <T extends object>(config: Record<string, unknown>, classEnv: ClassConstructor<T>): T => {
  const envConfig = plainToInstance(classEnv, config, { enableImplicitConversion: true });

  const errors = validateSync(envConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    const { constraints } = errors[0];

    const message = constraints ? `${Object.values(constraints)[0]}` : errors.toString();

    throw new InternalServerErrorException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
    });
  }

  return envConfig;
};
