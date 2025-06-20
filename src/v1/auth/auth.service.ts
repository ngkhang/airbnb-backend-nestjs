import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { EnvConfig, envKeys } from 'src/core/config/env-keys';
import { AuthJwtPayload } from 'src/core/jwt/jwt.type';
import { ClientErrorMessages, ErrorCodes, ServerErrorMessages, SuccessMessages } from 'src/shared/constant/message';
import { ServiceReturn } from 'src/shared/types/service.type';
import { comparePassword } from 'src/utils/password.util';

import { UsersServicePort } from '../users/domain/ports/user-service.port';
import { User } from '../users/domain/user';
import { USERS_SERVICE } from '../users/users-di.token';

import { AuthServicePort } from './domain/ports/auth-service.port';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersService: UsersServicePort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {}

  async loginByEmail(credential: Pick<User, 'email' | 'password'>): ServiceReturn<{ user: User; accessToken: string }> {
    const user = await this.usersService.getUserByEmail(credential.email);

    if (!user.success) {
      return {
        success: user.success,
        statusCode: HttpStatus.NOT_FOUND,
        message: ClientErrorMessages.EMAIL_NOT_REGISTERED,
        errors: {
          code: ErrorCodes.RESOURCE_NOT_FOUND,
          message: ServerErrorMessages.RESOURCE_NOT_FOUND,
          field: 'email',
          value: credential.email,
        },
      };
    }

    if (!comparePassword(credential.password, user.data.password)) {
      return {
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ClientErrorMessages.PASSWORD_INCORRECT,
        errors: {
          code: ErrorCodes.AUTH_UNAUTHORIZED,
          message: ServerErrorMessages.AUTH_UNAUTHORIZED,
          field: 'password',
        },
      };
    }

    const { accessToken } = await this.generateAccessToken({ userId: user.data.id, role: user.data.role });

    return {
      success: true,
      data: {
        user: user.data,
        accessToken,
      },
      message: SuccessMessages.LOGIN,
    };
  }

  async registerByEmail(newUser: Pick<User, 'email' | 'password'>): ServiceReturn<{ userId: User['id'] }> {
    const result = await this.usersService.createUser(newUser);

    if (!result.success) {
      return {
        success: false,
        statusCode: result.statusCode,
        message: result.message,
        errors: result.errors,
      };
    }

    return {
      success: true,
      data: {
        userId: result.data,
      },
      message: SuccessMessages.REGISTER,
    };
  }

  private async generateAccessToken(payload: AuthJwtPayload): Promise<{ accessToken: string }> {
    const { jwtIssuer, jwtAuthSecretKey, jwtAuthExpiresIn } = this.configService.getOrThrow(envKeys.jwt, {
      infer: true,
    });

    const accessToken = await this.jwtService.signAsync(payload, {
      issuer: jwtIssuer,
      secret: jwtAuthSecretKey,
      expiresIn: jwtAuthExpiresIn,
    });

    return {
      accessToken,
    };
  }
}
