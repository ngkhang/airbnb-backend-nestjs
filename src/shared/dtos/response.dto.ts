/**
 * The api response DTO
 */
class ApiResponseDto<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  requestPath: string;
}

/**
 * The success response DTO
 */
export class SuccessApiResponseDto<T> extends ApiResponseDto<T> {}

/**
 * The error response DTO
 */
export class ErrorApiResponseDto extends ApiResponseDto<null> {}
