import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { CLIENT_MESSAGES } from 'src/shared/constant/client-message';
import { ErrorCodes } from 'src/shared/constant/errorCodes';
import { ServiceReturn } from 'src/shared/types/service.type';
import { hashPassword } from 'src/utils/password.util';

import { UsersRepositoryPort } from './domain/ports/user-repository.port';
import { UsersServicePort } from './domain/ports/user-service.port';
import { User, UserAccountStatus, UserCredential, UserRole } from './domain/user';
import { USERS_REPOSITORY } from './users-di.token';

@Injectable()
export class UsersService implements UsersServicePort {
  constructor(@Inject(USERS_REPOSITORY) private readonly userRepo: UsersRepositoryPort) {}

  async getUserById(id: User['id']): ServiceReturn<User> {
    const user = await this.userRepo.findById(id);

    if (!user) {
      return {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: CLIENT_MESSAGES.ERROR.NOT_FOUND,
        errors: {
          code: ErrorCodes.RESOURCE_NOT_FOUND,
          message: `Not found user with id ${id}`,
          field: 'id',
          value: id,
        },
      };
    }
    return {
      success: true,
      data: user,
      message: CLIENT_MESSAGES.SUCCESS.OK,
    };
  }

  async getUserByEmail(email: string): ServiceReturn<User> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      return {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: CLIENT_MESSAGES.ERROR.NOT_FOUND,
        errors: {
          code: ErrorCodes.RESOURCE_NOT_FOUND,
          message: `Not found user with ${email}`,
          field: 'email',
          value: email,
        },
      };
    }
    return {
      success: true,
      data: user,
      message: CLIENT_MESSAGES.SUCCESS.OK,
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
        message: CLIENT_MESSAGES.ERROR.AUTH_EMAIL_ALREADY_REGISTERED,
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
      role: userCredential.role || UserRole.USER,
      status: userCredential.status || UserAccountStatus.PENDING_VERIFICATION,
    });

    return {
      success: true,
      data: userId,
      message: CLIENT_MESSAGES.SUCCESS.USER_CREATED,
    };
  }
}
