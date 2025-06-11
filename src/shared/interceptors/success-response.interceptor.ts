import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

import { ControllerResponseDto } from '../dtos/controller.dto';
import { SuccessResponseDto } from '../dtos/response.dto';

@Injectable()
export class SuccessResponseInterceptor<TData>
  implements NestInterceptor<ControllerResponseDto<TData>, SuccessResponseDto<TData>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<ControllerResponseDto<TData>>,
  ): Observable<SuccessResponseDto<TData>> | Promise<Observable<SuccessResponseDto<TData>>> {
    return next.handle().pipe(
      map(({ data, message }): SuccessResponseDto<TData> => {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const { statusCode } = http.getResponse<Response>();

        return {
          success: true,
          statusCode,
          message,
          data,
          requestPath: request.url,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
