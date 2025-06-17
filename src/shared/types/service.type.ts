import type { ApiResponse } from './response.type';

/**
 * The service layer types
 */
export type ServiceReturn<TData> = Promise<
  | ({ success: true } & Pick<ApiResponse<TData>, 'data' | 'message'>)
  | ({ success: false } & Pick<ApiResponse<TData>, 'errors' | 'statusCode' | 'message'>)
>;
