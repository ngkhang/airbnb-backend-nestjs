/**
 * Enumeration of success response codes for API operations
 */
export enum SuccessCodes {
  GENERIC = 'GENERIC',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  USER_CREATED = 'USER_CREATED',
}

/**
 * Human-readable success messages corresponding to success codes
 */
export const SuccessMessages: Record<SuccessCodes, string> = {
  [SuccessCodes.GENERIC]: 'Operation completed successfully',
  [SuccessCodes.LOGIN]: 'Logged in successfully',
  [SuccessCodes.REGISTER]: 'Registered successfully',
  [SuccessCodes.USER_CREATED]: 'Account created successfully',
};

/**
 * Enumeration of general error codes that can occur across the application
 */
export enum ErrorCodes {
  // General
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',

  // Token
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INCORRECT = 'TOKEN_INCORRECT',

  // Resource
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',

  // Validation
  VALIDATION_INPUT_INVALID = 'VALIDATION_INPUT_INVALID',
}

/**
 * Enumeration of client-specific error codes for user-facing operations
 */
export enum ClientErrorCodes {
  EMAIL_NOT_REGISTERED = 'EMAIL_NOT_REGISTERED',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  PASSWORD_INCORRECT = 'PASSWORD_INCORRECT',
}

export type AllErrorCodes = ErrorCodes | ClientErrorCodes;

/**
 * User-friendly error messages displayed to clients
 * * Maps both general and client-specific error codes to human-readable messages
 */
export const ClientErrorMessages: Record<AllErrorCodes, string> = {
  // General
  [ErrorCodes.INTERNAL_ERROR]: 'Something went wrong. Please try again later.',
  [ErrorCodes.AUTH_UNAUTHORIZED]: 'Access denied',

  // Token
  [ErrorCodes.TOKEN_NOT_FOUND]: 'Authentication required',
  [ErrorCodes.TOKEN_INVALID]: 'Invalid session. Please log in again',
  [ErrorCodes.TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
  [ErrorCodes.TOKEN_INCORRECT]: 'Authentication failed',

  // Resource
  [ErrorCodes.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ErrorCodes.RESOURCE_CONFLICT]: 'Resource already exists',

  // Validation
  [ErrorCodes.VALIDATION_INPUT_INVALID]: 'Invalid input data',

  // Client-specific
  [ClientErrorCodes.EMAIL_NOT_REGISTERED]: 'Email address is not registered',
  [ClientErrorCodes.EMAIL_ALREADY_EXISTS]: 'An account with this email address already exists',
  [ClientErrorCodes.PASSWORD_INCORRECT]: 'Password is incorrect',
};

/**
 * Technical error messages for server-side logging and debugging
 * * Contains detailed information suitable for developers and logs
 */
export const ServerErrorMessages: Record<ErrorCodes, string> = {
  // General
  [ErrorCodes.INTERNAL_ERROR]: 'Internal server error occurred',
  [ErrorCodes.AUTH_UNAUTHORIZED]: 'User lacks required permissions',

  // Token
  [ErrorCodes.TOKEN_NOT_FOUND]: 'JWT token not found in request headers',
  [ErrorCodes.TOKEN_INVALID]: 'JWT token format is invalid',
  [ErrorCodes.TOKEN_EXPIRED]: 'JWT token has expired',
  [ErrorCodes.TOKEN_INCORRECT]: 'JWT token signature verification failed',

  // Resource
  [ErrorCodes.RESOURCE_NOT_FOUND]: 'Requested resource does not exist',
  [ErrorCodes.RESOURCE_CONFLICT]: 'Resource conflicts with existing data',

  // Validation
  [ErrorCodes.VALIDATION_INPUT_INVALID]: 'Invalid input data',
};
