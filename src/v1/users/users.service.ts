import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { ErrorCodes } from 'src/shared/constant/errorCodes';
import { baseMessage, userMessage } from 'src/shared/constant/message';
import { ServiceReturn } from 'src/shared/types/service.type';

import { UsersRepositoryPort } from './domain/ports/user-repository.port';
import { UsersServicePort } from './domain/ports/user-service.port';
import { User } from './domain/user';
import { USERS_REPOSITORY } from './users-di.token';

const { error } = userMessage;

@Injectable()
export class UsersService implements UsersServicePort {
  constructor(@Inject(USERS_REPOSITORY) private readonly userRepo: UsersRepositoryPort) {}

  async getUserByEmail(email: string): ServiceReturn<User> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      return {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: error.notFound('user', email),
        errors: {
          code: ErrorCodes.RESOURCE_NOT_FOUND,
          message: `${email} is not found`,
          field: 'email',
          value: email,
        },
      };
    }
    return {
      success: true,
      data: user,
      message: baseMessage.success.default,
    };
  }
}
