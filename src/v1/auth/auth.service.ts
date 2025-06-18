import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { ErrorCodes } from 'src/shared/constant/errorCodes';
import { authMessage } from 'src/shared/constant/message';
import { ServiceReturn } from 'src/shared/types/service.type';
import { comparePassword } from 'src/utils/password.util';

import { UsersServicePort } from '../users/domain/ports/user-service.port';
import { User } from '../users/domain/user';
import { USERS_SERVICE } from '../users/users-di.token';

import { AuthServicePort } from './domain/ports/auth-service.port';

const { error, success } = authMessage;

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(@Inject(USERS_SERVICE) private readonly usersService: UsersServicePort) {}

  async loginByEmail(credential: Pick<User, 'email' | 'password'>): ServiceReturn<{ user: User; accessToken: string }> {
    const user = await this.usersService.getUserByEmail(credential.email);

    if (!user.success) {
      return {
        success: user.success,
        statusCode: HttpStatus.NOT_FOUND,
        message: error.emailNotRegistered,
        errors: {
          code: ErrorCodes.RESOURCE_NOT_FOUND,
          message: `Not found user with ${credential.email}`,
          field: 'email',
          value: credential.email,
        },
      };
    }

    if (!comparePassword(credential.password, user.data.password)) {
      return {
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.incorrectPassword,
        errors: {
          code: ErrorCodes.AUTH_UNAUTHORIZED,
          message: 'Authentication failed',
          field: 'password',
        },
      };
    }

    // TODO: Generate accessToken
    const accessToken = '';

    return {
      success: true,
      data: {
        user: user.data,
        accessToken,
      },
      message: success.login,
    };
  }
}
