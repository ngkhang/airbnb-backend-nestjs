import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ErrorDetailException } from 'src/core/filters/error-detail.exception';

import { ServerErrorCode } from '../constant/errorCode';
import { ClientErrorMessage, ServerErrorMessage } from '../constant/message';

/**
 * The number of rounds to use for generating the salt.
 */
const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password using bcrypt.
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export const hashPassword = (password: string): string => {
  try {
    const SALT = bcrypt.genSaltSync(SALT_ROUNDS);

    return bcrypt.hashSync(password, SALT);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new ErrorDetailException(
      {
        message: ClientErrorMessage.INTERNAL_SERVER_ERROR,
        errors: [
          {
            message: ServerErrorMessage.PASSWORD_HASHING_FAILED,
            code: ServerErrorCode.PASSWORD_HASHING_FAILED,
          },
        ],
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Hashes a plain text password using bcrypt.
 * @param password - The plain text password to hash
 * @param storeHash - The stored hash (which includes the salt) to compare against.
 * @returns True if the password matches the hash, false otherwise
 */
export const comparePassword = (password: string, storeHash: string): boolean => {
  try {
    return bcrypt.compareSync(password, storeHash);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new ErrorDetailException(
      {
        message: ClientErrorMessage.INTERNAL_SERVER_ERROR,
        errors: [
          {
            message: ServerErrorMessage.PASSWORD_COMPARE_FAILED,
            code: ServerErrorCode.PASSWORD_COMPARE_FAILED,
          },
        ],
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
