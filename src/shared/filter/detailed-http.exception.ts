import { HttpException, HttpStatus } from '@nestjs/common';

import type { ApiResponse } from '../types/response.type';

export type DetailedErrorPayload = Pick<ApiResponse<null>, 'message' | 'errors'>;

export class DetailedHttpException extends HttpException {
  constructor(payload: DetailedErrorPayload, status: number = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(payload, status);
  }
}
