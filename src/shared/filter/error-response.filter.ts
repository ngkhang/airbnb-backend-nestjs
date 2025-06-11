import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

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
      errors: errors || [],
      requestPath: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private extractErrorDetails(exception: HttpException): { message: string; errors?: ApiErrorDetailDto[] | null } {
    const rawResponse = exception.getResponse();

    if (exception instanceof DetailedHttpException) {
      const payload = <DetailedErrorPayload>rawResponse;

      return {
        message: payload.message,
        errors: payload.errors,
      };
    }

    if (typeof rawResponse === 'string') {
      return {
        message: rawResponse,
        errors: [],
      };
    }

    if ('message' in rawResponse) {
      const message = <string>rawResponse.message;
      const errors = 'errors' in rawResponse ? <ApiErrorDetailDto[]>rawResponse.errors : null;

      return {
        message,
        errors,
      };
    }

    return {
      message: 'Internal Server Error',
    };
  }
}
