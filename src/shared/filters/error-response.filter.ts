import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { ErrorApiResponseDto } from '../dtos/response.dto';

@Catch(HttpException)
@Injectable()
export class ErrorResponseExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    const { message } = <Pick<ErrorApiResponseDto, 'message'>>exception.getResponse();

    const errorResponse: ErrorApiResponseDto = {
      isSuccess: false,
      statusCode,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      requestPath: request.url,
    };

    response.status(statusCode).json(errorResponse);
  }
}
