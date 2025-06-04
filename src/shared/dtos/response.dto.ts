import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Base API response DTO with common fields',
})
class ApiResponseDto {
  @ApiProperty({ type: Boolean, description: 'Indicates if the request was successful' })
  isSuccess: boolean;

  @ApiProperty({ type: Number, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ type: String, description: 'Response message' })
  message: string;

  @ApiProperty({
    type: String,
    description: 'Response timestamp in ISO format',
    example: new Date().toISOString(),
  })
  timestamp: string;

  @ApiProperty({ type: String, description: 'Request path that generated this response', example: '/api/v1/users' })
  requestPath: string;
}

@ApiSchema({
  description: 'Error detail information',
})
class ApiErrorDetailDto {
  @ApiProperty({ type: String, description: 'Error message description' })
  message: string;

  @ApiProperty({ type: String, description: 'Error code identifier' })
  code: string;

  @ApiPropertyOptional({ type: String, description: 'Field that caused the error' })
  field?: string;

  @ApiPropertyOptional({ description: 'Value that caused the error', example: null })
  value?: any;
}

@ApiSchema({
  description: 'Success API response DTO with typed data payload',
})
export class SuccessApiResponseDto<T> extends ApiResponseDto {
  @ApiProperty({
    type: Object,
    description: 'Response data payload',
  })
  data: T;
}

@ApiSchema({
  description: 'Error API response DTO with error details',
})
export class ErrorApiResponseDto extends ApiResponseDto {
  @ApiProperty({
    type: 'null',
    description: 'Data payload (always null for errors)',
    example: null,
  })
  data: null;

  @ApiProperty({
    isArray: true,
    type: () => ApiErrorDetailDto,
    description: 'Array of error details',
  })
  errors: ApiErrorDetailDto[];
}
