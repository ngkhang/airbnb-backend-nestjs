import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

import { ClientErrorMessage } from 'src/shared/constant/message';
import { ErrorDetailDto } from 'src/shared/dto/error-response.dto';
import { ErrorResponseDto } from 'src/shared/dto/response.dto';

import { ErrorDetailException, ErrorDetailPayload } from './error-detail.exception';

@Catch(HttpException)
export class ErrorResponseFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<ErrorResponseDto>>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    const { message, errors } = this.extractErrorDetails(exception);

    const errorResponse = new ErrorResponseDto({
      statusCode,
      message,
      errors,
      requestPath: request.url,
    });

    response.status(statusCode).json(errorResponse);
  }

  private extractErrorDetails(exception: HttpException): ErrorDetailPayload {
    // Case 1: Handle with ErrorDetailException()
    if (exception instanceof ErrorDetailException) {
      const payload = exception.getErrorDetails();
      return payload;
    }

    const rawResponse = exception.getResponse();

    let message = ClientErrorMessage.INTERNAL_SERVER_ERROR;
    let errors: ErrorDetailDto[] = [];

    // Case 2: Handle string response: HttpException(message, statusCode)
    if (typeof rawResponse === 'string') {
      return {
        message: rawResponse,
        errors,
      };
    }

    // Case 3: Handle NestJS validation errors
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof rawResponse === 'object' && rawResponse !== null) {
      const obj = <Record<string, unknown>>rawResponse;

      if (typeof obj.message === 'string') {
        message = obj.message;
      }
      if (Array.isArray(obj.errors) && obj.errors instanceof ErrorDetailDto) {
        errors = obj.errors;
      }
    }

    // Case 4: Default fallback
    return {
      message,
      errors,
    };
  }
}
