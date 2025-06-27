import type { ApiResponse } from './response.type';

export type ServiceReturn<TData> = Promise<
  | ({ success: true } & Pick<ApiResponse<TData>, 'data' | 'message'>)
  | ({ success: false } & Pick<ApiResponse<null>, 'statusCode' | 'message' | 'errors'>)
>;
