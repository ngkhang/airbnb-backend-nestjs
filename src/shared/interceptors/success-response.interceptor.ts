import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

import { SuccessApiResponseDto } from '../dtos/response.dto';

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<T, SuccessApiResponseDto<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessApiResponseDto<T>> | Promise<Observable<SuccessApiResponseDto<T>>> {
    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map(({ data, message }: Pick<SuccessApiResponseDto<T>, 'data' | 'message'>): SuccessApiResponseDto<T> => {
        return {
          isSuccess: true,
          statusCode: response.statusCode,
          message,
          data,
          timestamp: new Date().toISOString(),
          requestPath: request.url,
        };
      }),
    );
  }
}
