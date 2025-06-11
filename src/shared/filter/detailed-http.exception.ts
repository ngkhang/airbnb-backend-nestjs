import { HttpException } from '@nestjs/common';

import type { ApiErrorDetail } from '../types/response.type';

export interface DetailedErrorPayload {
  message: string;
  errors: ApiErrorDetail[];
}

export class DetailedHttpException extends HttpException {
  constructor(payload: DetailedErrorPayload, status: number) {
    super(payload, status);
  }
}
