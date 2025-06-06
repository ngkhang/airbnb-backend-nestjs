class ApiResponseDto {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  requestPath: string;
}

class ApiErrorDetailDto {
  message: string;
  code: string;
  field?: string;
  value?: any;
}

export class SuccessApiResponseDto<T> extends ApiResponseDto {
  data: T;
}

export class ErrorApiResponseDto extends ApiResponseDto {
  data: null;
  errors: ApiErrorDetailDto[];
}
