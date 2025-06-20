/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, type ValidationPipeOptions } from '@nestjs/common';

import { ClientErrorMessages, ErrorCodes } from 'src/shared/constant/message';
import { DetailedHttpException } from 'src/shared/filter/detailed-http.exception';

import type { ValidationError } from 'class-validator';
import type { ApiErrorDetail } from 'src/shared/types/response.type';

export const validationOption: ValidationPipeOptions = {
  stopAtFirstError: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (validationErrors: ValidationError[]) => {
    const errorsDetail: ApiErrorDetail[] = validationErrors.map((error) => {
      const { property, value, constraints } = error;
      const firstConstraintMessage = constraints ? Object.values(constraints)[0] : '';

      return {
        code: ErrorCodes.VALIDATION_INPUT_INVALID,
        message: firstConstraintMessage,
        field: property,
        value,
      };
    });

    throw new DetailedHttpException(
      {
        message: ClientErrorMessages.VALIDATION_INPUT_INVALID,
        errors: errorsDetail,
      },
      HttpStatus.BAD_REQUEST,
    );
  },
};
