/**
 * Common Error Code Categories
 */
export enum ErrorCodes {
  /**
   * System: Rate limits, server errors, etc
   * - Prefix: SYSTEM_*
   */
  SYSTEM_INTERNAL_ERROR = 'SYSTEM_INTERNAL_ERROR',

  /**
   * Auth: Authentication/Authorization, etc
   * - Prefix: AUTH_*
   */
  AUTH_JWT_TOKEN_NOT_FOUND = 'AUTH_JWT_TOKEN_NOT_FOUND',
  AUTH_JWT_TOKEN_INVALID = 'AUTH_JWT_TOKEN_INVALID',
  AUTH_JWT_TOKEN_EXPIRED = 'AUTH_JWT_TOKEN_EXPIRED',
  AUTH_JWT_TOKEN_INCORRECT = 'AUTH_JWT_TOKEN_INCORRECT',
}
