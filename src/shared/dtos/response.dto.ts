import type { ErrorCodes } from '../constant/errorCodes';

export class ApiErrorDetailDto {
  message: string;
  code: ErrorCodes;
  field?: string;
  value?: string;
}

/**
 * The Success API response DTO with typed data payload
 */
export class SuccessResponseDto<TDataDto> {
  success: true;
  message: string;
  statusCode: number;
  data: TDataDto;
  timestamp: string;
  requestPath: string;
}

/**
 * The Error API response DTO with error details
 */
export class ErrorResponseDto {
  success: false;
  message: string;
  statusCode: number;
  data: null;
  errors: ApiErrorDetailDto[];
  timestamp: string;
  requestPath: string;
}
