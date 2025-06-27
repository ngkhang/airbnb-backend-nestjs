import { HttpException, HttpStatus } from '@nestjs/common';

import type { ApiResponse } from 'src/shared/types/response.type';

export type ErrorDetailPayload = Pick<ApiResponse<null>, 'message' | 'errors'>;

export class ErrorDetailException extends HttpException {
  private errorPayload: ErrorDetailPayload;

  constructor(payload: ErrorDetailPayload, status: number = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(payload, status);
    this.errorPayload = payload;
  }

  getErrorDetails(): ErrorDetailPayload {
    return this.errorPayload;
  }
}
