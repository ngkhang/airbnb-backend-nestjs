import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { stringify } from 'uuid';

import { ServerErrorCode } from 'src/shared/constant/errorCode';
import { ServerErrorMessage } from 'src/shared/constant/message';
import { ServiceReturn } from 'src/shared/types/service-return.type';
import { hashPassword } from 'src/shared/utils/password';
import { generateBinaryUuid } from 'src/shared/utils/uuid';

import { USER_MESSAGES } from './constants/user.message';
import { User, UserProfile } from './domain/user.entity';
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

  async createUserByEmail(newUser: Pick<User, 'email' | 'passwordHash'>): ServiceReturn<{ userId: string }> {
    const userExist = await this.userRepo.findByEmail(newUser.email);

    if (userExist) {
      return {
        success: false,
        message: USER_MESSAGES.ERROR.RESOURCE_ALREADY_EXISTS,
        statusCode: HttpStatus.CONFLICT,
        errors: [
          {
            code: ServerErrorCode.RESOURCE_ALREADY_EXISTS,
            message: ServerErrorMessage.RESOURCE_ALREADY_EXISTS,
            field: 'email',
            value: newUser.email,
          },
        ],
      };
    }

    const result = await this.userRepo.create({
      id: stringify(generateBinaryUuid()),
      email: newUser.email,
      passwordHash: hashPassword(newUser.passwordHash),
      username: newUser.email.split('@')[0],
    });

    return {
      success: true,
      data: {
        userId: result,
      },
      message: USER_MESSAGES.SUCCESS.CREATE,
    };
  }

  async updateProfileUser(
    userId: string,
    profile: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>,
  ): ServiceReturn<null> {
    const userExist = await this.userRepo.findById(userId);

    if (!userExist) {
      return {
        success: false,
        message: USER_MESSAGES.ERROR.RESOURCE_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
        errors: [
          {
            code: ServerErrorCode.RESOURCE_NOT_FOUND,
            message: ServerErrorMessage.RESOURCE_NOT_FOUND,
            field: 'id',
            value: userId,
          },
        ],
      };
    }

    if (profile.phoneNumber) {
      const phoneNumberExist = await this.userRepo.findByPhone(profile.phoneNumber);

      if (phoneNumberExist) {
        return {
          success: false,
          message: USER_MESSAGES.ERROR.CONFLICT_PHONE_NUMBER,
          statusCode: HttpStatus.CONFLICT,
          errors: [
            {
              code: ServerErrorCode.RESOURCE_ALREADY_EXISTS,
              message: ServerErrorMessage.RESOURCE_ALREADY_EXISTS,
              field: 'phone number',
              value: profile.phoneNumber,
            },
          ],
        };
      }
    }

    const result = await this.userRepo.update(userId, null, profile);

    return {
      success: true,
      data: result,
      message: USER_MESSAGES.SUCCESS.UPDATE,
    };
  }

  async deleteUser(userId: string): ServiceReturn<null> {
    const userExist = await this.userRepo.findById(userId);

    if (!userExist) {
      return {
        success: false,
        message: USER_MESSAGES.ERROR.RESOURCE_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
        errors: [
          {
            code: ServerErrorCode.RESOURCE_NOT_FOUND,
            message: ServerErrorMessage.RESOURCE_NOT_FOUND,
            field: 'id',
            value: userId,
          },
        ],
      };
    }
    const result = await this.userRepo.delete(userId);

    return {
      success: true,
      data: result,
      message: USER_MESSAGES.SUCCESS.DELETE,
    };
  }
}
