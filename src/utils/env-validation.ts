import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validateEnv = <T extends object>(
  config: Record<string, unknown>,
  envVariables: ClassConstructor<T>,
): T => {
  const validatedConfig = plainToInstance(envVariables, config, { enableImplicitConversion: true });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    const { constraints } = errors[0];

    const errorMessage = constraints ? `${Object.values(constraints)[0]}` : errors.toString();

    throw new InternalServerErrorException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage,
    });
  }

  return validatedConfig;
};
