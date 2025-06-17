import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { ErrorCodes } from 'src/shared/constant/errorCodes';
import { baseMessage, userMessage } from 'src/shared/constant/message';
import { ServiceReturn } from 'src/shared/types/service.type';
import { hashPassword } from 'src/utils/password.util';

import { UsersRepositoryPort } from './domain/ports/user-repository.port';
import { UsersServicePort } from './domain/ports/user-service.port';
import { User, UserAccountStatus, UserCredential, UserRole } from './domain/user';
import { USERS_REPOSITORY } from './users-di.token';

const { error, success } = userMessage;

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

  async createUser(
    userCredential: Pick<UserCredential, 'email' | 'password'> & Partial<UserCredential>,
  ): ServiceReturn<User['id']> {
    const emailExist = await this.userRepo.findByEmail(userCredential.email);

    if (emailExist) {
      return {
        success: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.emailAlreadyRegistered,
        errors: {
          code: ErrorCodes.RESOURCE_CONFLICT,
          message: 'Resource conflict email',
          field: 'email',
          value: userCredential.email,
        },
      };
    }

    const userId = await this.userRepo.create({
      email: userCredential.email,
      password: hashPassword(userCredential.password),
      username: userCredential.email.split('@')[0],
      role: UserRole[userCredential.role || 'USER'],
      status: UserAccountStatus[userCredential.status || 'PENDING_VERIFICATION'],
    });

    return {
      success: true,
      data: userId,
      message: success.created,
    };
  }
}
