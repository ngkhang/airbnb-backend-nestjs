import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { ErrorDetailDto } from './error-response.dto';

@ApiSchema({
  name: 'BaseResponseDto',
  description: 'Base response structure',
})
class BaseResponseDto<T> {
  @ApiProperty({ type: Boolean, description: 'Indicates if the request was successful' })
  success: boolean;

  @ApiProperty({ type: Number, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ type: String, description: 'Response message' })
  message: string;

  @ApiProperty({ type: Object, description: 'The response data payload' })
  data: T;

  @ApiProperty({ type: String, description: 'Request path that generated this response' })
  requestPath: string;

  @ApiProperty({ type: String, description: 'Response timestamp in ISO format' })
  timestamp: string;

  constructor(payload: Omit<BaseResponseDto<T>, 'timestamp'>) {
    Object.assign(this, {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }
}

@ApiSchema({
  name: 'SuccessResponseDto',
  description: 'Success API response DTO',
})
export class SuccessResponseDto<T = null> extends BaseResponseDto<T | null> {
  constructor(payload: { requestPath: string; statusCode?: number; message?: string; data?: T }) {
    super({
      success: true,
      statusCode: payload.statusCode || HttpStatus.OK,
      message: payload.message || 'Success',
      data: payload.data ?? null,
      requestPath: payload.requestPath,
    });
  }
}

@ApiSchema({
  name: 'ErrorResponseDto',
  description: 'Error API response DTO',
})
export class ErrorResponseDto extends BaseResponseDto<null> {
  @ApiPropertyOptional({ type: () => ErrorDetailDto, isArray: true, description: 'Error details' })
  errors: ErrorDetailDto[];

  constructor(payload: { requestPath: string; errors?: ErrorDetailDto[]; statusCode?: number; message?: string }) {
    super({
      success: false,
      statusCode: payload.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      message: payload.message || 'Internal Server Error',
      data: null,
      requestPath: payload.requestPath,
    });
    this.errors = payload.errors ?? [];
  }
}
