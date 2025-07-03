/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus } from '@nestjs/common';
import { stringify, parse, v4 as uuidV4 } from 'uuid';

import { ErrorDetailException } from 'src/core/filters/error-detail.exception';

import { ServerErrorCode } from '../constant/errorCode';
import { ClientErrorMessage, ServerErrorMessage } from '../constant/message';

/**
 * Generate a binary UUID (Buffer)
 */
export const generateBinaryUuid = (): Uint8Array => {
  try {
    const buffer = Buffer.alloc(16);
    return uuidV4({}, buffer);
  } catch (error) {
    throw new ErrorDetailException(
      {
        message: ClientErrorMessage.INTERNAL_SERVER_ERROR,
        errors: [
          {
            message: ServerErrorMessage.UUID_PROCESS_FAILED,
            code: ServerErrorCode.UUID_PROCESS_FAILED,
          },
        ],
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Convert a binary UUID to a string UUID
 */
export const binaryToUuid = (binary: Uint8Array): string => {
  try {
    return stringify(binary);
  } catch (error) {
    throw new ErrorDetailException(
      {
        message: ClientErrorMessage.INTERNAL_SERVER_ERROR,
        errors: [
          {
            message: ServerErrorMessage.UUID_PROCESS_FAILED,
            code: ServerErrorCode.UUID_PROCESS_FAILED,
          },
        ],
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Convert a string UUID to a binary UUID
 */
export const uuidToBinary = (uuid: string): Uint8Array => {
  try {
    return parse(uuid);
  } catch (error) {
    throw new ErrorDetailException(
      {
        message: ClientErrorMessage.INTERNAL_SERVER_ERROR,
        errors: [
          {
            message: ServerErrorMessage.UUID_PROCESS_FAILED,
            code: ServerErrorCode.UUID_PROCESS_FAILED,
          },
        ],
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
