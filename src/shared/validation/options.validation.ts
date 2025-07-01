/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, type ValidationPipeOptions } from '@nestjs/common';

import { ErrorDetailException } from 'src/core/filters/error-detail.exception';

import { ServerErrorCode } from '../constant/errorCode';
import { ClientErrorMessage } from '../constant/message';

import type { ApiErrorDetail } from '../types/response.type';
import type { ValidationError } from 'class-validator';

export const optionsValidation: ValidationPipeOptions = {
  stopAtFirstError: true,
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (validationErrors: ValidationError[]) => {
    const errors: ApiErrorDetail[] = validationErrors.map((error: ValidationError) => {
      const { property, value, constraints } = error;
      const firstConstraintMessage = constraints ? Object.values(constraints)[0] : '';

      return {
        code: ServerErrorCode.VALIDATION_FAILED,
        message: firstConstraintMessage,
        field: property,
        value,
      };
    });

    throw new ErrorDetailException(
      {
        message: ClientErrorMessage.VALIDATION_FAILED,
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  },
};
