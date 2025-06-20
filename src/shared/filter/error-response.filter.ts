import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

import { ClientErrorMessages } from '../constant/message';
import { ApiErrorDetailDto, ErrorResponseDto } from '../dtos/response.dto';

import { DetailedErrorPayload, DetailedHttpException } from './detailed-http.exception';

@Catch(HttpException)
export class ErrorResponseExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<ErrorResponseDto>>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    const { message, errors } = this.extractErrorDetails(exception);

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      data: null,
      errors,
      requestPath: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private extractErrorDetails(exception: HttpException): DetailedErrorPayload {
    const rawResponse = exception.getResponse();

    // Handle DetailedHttpException
    if (exception instanceof DetailedHttpException) {
      const payload = <DetailedErrorPayload>rawResponse;

      return {
        message: payload.message,
        errors: payload.errors,
      };
    }

    // Handle standard HttpException
    let message = ClientErrorMessages.INTERNAL_ERROR;
    let errors: ApiErrorDetailDto[] = [];

    if (typeof rawResponse === 'string') {
      return {
        message: rawResponse,
        errors,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (rawResponse !== null && typeof rawResponse === 'object') {
      if ('message' in rawResponse) {
        message = String(rawResponse.message);
      }

      if ('errors' in rawResponse && Array.isArray(rawResponse.errors)) {
        errors = <ApiErrorDetailDto[]>rawResponse.errors;
      }
    }

    return { message, errors };
  }
}
