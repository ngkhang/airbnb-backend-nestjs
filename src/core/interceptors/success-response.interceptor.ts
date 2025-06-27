import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

import { ControllerReturnDto } from 'src/shared/dto/controller-response.dto';
import { SuccessResponseDto } from 'src/shared/dto/response.dto';

@Injectable()
export class SuccessResponseInterceptor<TData>
  implements NestInterceptor<ControllerReturnDto<TData>, SuccessResponseDto<TData>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<ControllerReturnDto<TData>>,
  ): Observable<SuccessResponseDto<TData>> | Promise<Observable<SuccessResponseDto<TData>>> {
    return next.handle().pipe(
      map((payload): SuccessResponseDto<TData> => {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const { statusCode } = http.getResponse<Response>();

        return new SuccessResponseDto({
          statusCode,
          ...payload,
          requestPath: request.url,
        });
      }),
    );
  }
}
