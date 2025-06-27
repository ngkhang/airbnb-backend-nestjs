import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ErrorDetailException } from 'src/core/filters/error-detail.exception';

import { ServerErrorCode } from '../constant/errorCode';
import { ServerErrorMessage } from '../constant/message';

import type { ClassConstructor } from 'class-transformer';

export const validationEnv = <T extends object>(config: Record<string, unknown>, classEnv: ClassConstructor<T>): T => {
  const envConfig = plainToInstance(classEnv, config, { enableImplicitConversion: true });

  const errors = validateSync(envConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    const { constraints } = errors[0];

    const message = constraints ? `${Object.values(constraints)[0]}` : errors.toString();

    throw new ErrorDetailException(
      {
        message,
        errors: [
          {
            code: ServerErrorCode.VALIDATION_FAILED,
            message: ServerErrorMessage.VALIDATION_FAILED,
          },
        ],
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  return envConfig;
};
