import { ClientErrorCode, ServerErrorCode } from './errorCode';

import type { TClientErrorCode, TServerErrorCode } from './errorCode';

/**
 * Technical error messages for server logs and debugging
 * * Contains detailed information for developers
 */
export const ServerErrorMessage: Record<TServerErrorCode, string> = {
  [ServerErrorCode.INTERNAL_SERVER_ERROR]: 'An unexpected server error occurred during request processing',

  // Authentication errors
  [ServerErrorCode.AUTH_TOKEN_MISSING]: 'Authorization header missing or JWT token not provided in request',
  [ServerErrorCode.AUTH_TOKEN_EXPIRED]: 'JWT token has passed its expiration time and is no longer valid',
  [ServerErrorCode.AUTH_TOKEN_PAYLOAD_INVALID]: 'JWT token payload contains invalid or incorrect data',
  [ServerErrorCode.AUTH_TOKEN_FORMAT_INVALID]: 'JWT token structure is malformed, corrupted, or cannot be parsed',

  // Validation errors
  [ServerErrorCode.VALIDATION_FAILED]: 'Field value does not match expected format or pattern',

  // Password errors
  [ServerErrorCode.PASSWORD_HASHING_FAILED]: 'The process of hashing the password failed',
  [ServerErrorCode.PASSWORD_COMPARE_FAILED]: 'The process of comparing the password failed',

  [ServerErrorCode.UUID_PROCESS_FAILED]: 'The process of uuid failed',

  [ServerErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found',
};

/**
 * User-facing error messages for client display
 * * Human-readable messages that don't expose technical details
 */
export const ClientErrorMessage: Record<TClientErrorCode, string> = {
  [ClientErrorCode.INTERNAL_SERVER_ERROR]: 'Something went wrong on our end. Please try again in a moment.',

  // Authentication errors
  [ClientErrorCode.AUTH_TOKEN_MISSING]: 'Access denied',
  [ClientErrorCode.AUTH_TOKEN_EXPIRED]: 'Your session has expired. Please sign in again.',
  [ClientErrorCode.AUTH_TOKEN_PAYLOAD_INVALID]: 'Authentication failed. Please sign in again.',
  [ClientErrorCode.AUTH_TOKEN_FORMAT_INVALID]: 'Authentication error. Please sign in again.',

  // Validation errors
  [ClientErrorCode.VALIDATION_FAILED]: 'Please check your input and try again.',
};
