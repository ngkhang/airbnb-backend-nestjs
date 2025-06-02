import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import type { ClassConstructor } from 'class-transformer';

export function validateEnv<T extends object>(config: Record<string, unknown>, envVariable: ClassConstructor<T>): T {
  const validatedConfig = plainToInstance(envVariable, config, { enableImplicitConversion: true });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    const { constraints } = errors[0];

    const errorMess = constraints ? `${Object.values(constraints)[0]}` : errors.toString();

    throw new InternalServerErrorException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: errorMess,
    });
  }
  return validatedConfig;
}
