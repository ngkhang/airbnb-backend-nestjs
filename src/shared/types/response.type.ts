export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

type SuccessResponse<T> = Pick<ApiResponse<T>, 'data' | 'message'>;
type ErrorResponse = Pick<ApiResponse<null>, 'message' | 'statusCode'>;

/**
 * Standardized response type for the service layer.
 */
export type ServiceResponse<T> = Promise<
  ({ isSuccess: true } & SuccessResponse<T>) | ({ isSuccess: false } & ErrorResponse)
>;

/**
 * Standardized response type for the controller layer.
 */
export type ControllerResponse<T> = Promise<Pick<ApiResponse<T>, 'data' | 'message'>>;
