import type { ErrorCodes } from '../constant/errorCodes';

export interface ApiErrorDetail {
  code: ErrorCodes;
  message: string;
  field?: string;
  value?: string;
}

export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  statusCode: number;
  data: TData;
  errors: ApiErrorDetail;
  timestamp: string;
  requestPath: string;
}
