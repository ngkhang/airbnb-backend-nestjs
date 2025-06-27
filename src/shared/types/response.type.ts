import type { TServerErrorCode } from '../constant/errorCode';

export interface ApiErrorDetail {
  code: TServerErrorCode;
  message: string;
  field?: string;
  value?: any;
}

export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  statusCode: number;
  data: TData;
  errors: ApiErrorDetail[];
  timestamp: string;
  requestPath: string;
}
