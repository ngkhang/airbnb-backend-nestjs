import type { ErrorCode } from '../constants/errorCodes';

// Core response types
interface BaseApiResponse<T> {
  message: string;
  data: T;
}

interface ApiErrorDetail {
  message: string;
  code: ErrorCode;
  field?: string;
  value?: unknown;
}

interface SuccessResponse<T> extends BaseApiResponse<T> {
  isSuccess: true;
}

interface ErrorResponse extends Pick<BaseApiResponse<null>, 'message'> {
  isSuccess: false;
  statusCode: number;
  errors: ApiErrorDetail[];
}

type ApiResult<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Service layer types
 */
export type ServiceResponse<T> = Promise<ApiResult<T>>;

/**
 * Controller layer types (simplified for HTTP responses)
 */
export type ControllerResponse<T> = Promise<BaseApiResponse<T>>;
