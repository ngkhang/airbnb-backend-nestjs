import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { ErrorCodes } from '../constant/errorCodes';

@ApiSchema({
  name: 'ApiErrorDetailDto',
  description: 'Error details',
})
export class ApiErrorDetailDto {
  @ApiProperty({
    type: String,
    description: 'Error message description',
  })
  message: string;

  @ApiProperty({
    enum: ErrorCodes,
    description: 'Error code identifier',
    example: ErrorCodes.SYSTEM_INTERNAL_ERROR,
  })
  code: ErrorCodes;

  @ApiPropertyOptional({
    type: String,
    description: 'Field that caused the error',
  })
  field?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Value that caused the error',
  })
  value?: string;
}

/**
 * The Success API response DTO with typed data payload
 */
@ApiSchema({
  name: 'SuccessResponseDto',
  description: 'Success API response DTO',
})
export class SuccessResponseDto<TDataDto> {
  @ApiProperty({
    type: Boolean,
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: true;

  @ApiProperty({
    type: String,
    description: 'Response message',
    example: 'Successful',
  })
  message: string;

  @ApiProperty({
    type: Number,
    description: 'HTTP status code',
    example: HttpStatus.OK,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    type: Object,
    description: 'The response data payload',
  })
  data: TDataDto;

  @ApiProperty({
    type: String,
    description: 'Response timestamp in ISO format',
    example: new Date().toISOString(),
  })
  timestamp: string;

  @ApiProperty({
    type: String,
    description: 'Request path that generated this response',
    example: '/api/v1/users',
  })
  requestPath: string;
}

/**
 * The Error API response DTO with error details
 */
@ApiSchema({
  name: 'ErrorResponseDto',
  description: 'Error API response DTO',
})
export class ErrorResponseDto {
  @ApiProperty({
    type: Boolean,
    description: 'Indicates if the request was successful',
    example: false,
  })
  success: false;

  @ApiProperty({
    type: String,
    description: 'Response message',
    example: 'Internal Server Error',
  })
  message: string;

  @ApiProperty({
    type: Number,
    description: 'HTTP status code',
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    type: 'null',
    description: 'The data payload (always null for errors)',
    example: null,
  })
  data: null;

  @ApiProperty({
    type: () => ApiErrorDetailDto,
    description: 'Error details',
    isArray: true,
  })
  errors: ApiErrorDetailDto[];

  @ApiProperty({
    type: String,
    description: 'Response timestamp in ISO format',
    example: new Date().toISOString(),
  })
  timestamp: string;

  @ApiProperty({
    type: String,
    description: 'Request path that generated this response',
    example: '/api/v1/users',
  })
  requestPath: string;
}
