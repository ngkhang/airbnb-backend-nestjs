enum BaseErrorEnum {
  // System errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

  // Authentication errors
  AUTH_TOKEN_MISSING = 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_PAYLOAD_INVALID = 'AUTH_TOKEN_PAYLOAD_INVALID',
  AUTH_TOKEN_FORMAT_INVALID = 'AUTH_TOKEN_FORMAT_INVALID',

  // Validation errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

export enum ServerErrorEnum {}

export const ServerErrorCode = { ...BaseErrorEnum, ...ServerErrorEnum };
export type TServerErrorCode = keyof typeof ServerErrorCode;

export enum ClientErrorEnum {}

export const ClientErrorCode = { ...BaseErrorEnum, ...ClientErrorEnum };
export type TClientErrorCode = keyof typeof ClientErrorCode;
