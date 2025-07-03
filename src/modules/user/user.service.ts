import { Inject, Injectable } from '@nestjs/common';

import { ServerErrorCode } from 'src/shared/constant/errorCode';
import { ServerErrorMessage } from 'src/shared/constant/message';
import { ServiceReturn } from 'src/shared/types/service-return.type';

import { USER_MESSAGES } from './constants/user.message';
import { User } from './domain/user.entity';
import { UserRepositoryPort, UserServicePort } from './domain/user.port';
import { USER_REPOSITORY } from './user-di.token';

@Injectable()
export class UserService implements UserServicePort {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort) {}

  async getAllUsers(): ServiceReturn<User[]> {
    const users = await this.userRepo.findAll();
    return {
      success: true,
      data: users,
      message: USER_MESSAGES.SUCCESS.DEFAULT,
    };
  }

  async getUserById(id: string): ServiceReturn<User> {
    const user = await this.userRepo.findById(id);

    if (!user) {
      return {
        success: false,
        message: USER_MESSAGES.ERROR.RESOURCE_NOT_FOUND,
        statusCode: 404,
        errors: [
          {
            code: ServerErrorCode.RESOURCE_NOT_FOUND,
            message: ServerErrorMessage.RESOURCE_NOT_FOUND,
            field: 'id',
            value: id,
          },
        ],
      };
    }

    return {
      success: true,
      data: user,
      message: USER_MESSAGES.SUCCESS.DEFAULT,
    };
  }

  async getUserByEmail(email: string): ServiceReturn<User> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      return {
        success: false,
        message: USER_MESSAGES.ERROR.RESOURCE_NOT_FOUND,
        statusCode: 404,
        errors: [
          {
            code: ServerErrorCode.RESOURCE_NOT_FOUND,
            message: ServerErrorMessage.RESOURCE_NOT_FOUND,
            field: 'email',
            value: email,
          },
        ],
      };
    }

    return {
      success: true,
      data: user,
      message: USER_MESSAGES.SUCCESS.DEFAULT,
    };
  }
}
