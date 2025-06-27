export interface ApiErrorDetail {
  code: string;
  message: string;
  field?: string;
  value?: unknown;
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
