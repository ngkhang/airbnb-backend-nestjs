import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { APP_TOKEN } from 'src/core/jwt/jwt.const';
import { authMessage } from 'src/shared/constant/message';
import { authResource } from 'src/shared/constant/resource-endpoints';
import { ControllerResponseDto } from 'src/shared/dtos/controller.dto';
import { SuccessResponseDto } from 'src/shared/dtos/response.dto';
import { DetailedHttpException } from 'src/shared/filter/detailed-http.exception';

import { AuthLoginDto } from './application/dto/auth-login.dto';
import { LoginResponseDto } from './application/dto/login-response.dto';
import { AUTH_SERVICE } from './auth-di.token';
import { AuthControllerPort } from './domain/ports/auth-controller.port';
import { AuthServicePort } from './domain/ports/auth-service.port';

const { tagDoc, prefix, endpoints } = authResource;

@ApiTags(tagDoc)
@ApiBasicAuth(APP_TOKEN)
@Controller(prefix)
export class AuthController implements AuthControllerPort {
  constructor(@Inject(AUTH_SERVICE) private readonly authService: AuthServicePort) {}

  @ApiOperation({
    summary: 'Login by email and password',
  })
  @ApiExtraModels(SuccessResponseDto, LoginResponseDto)
  @ApiResponse({
    description: 'Successful',
    status: HttpStatus.OK,
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponseDto) },
        {
          properties: {
            statusCode: { example: HttpStatus.OK },
            data: { $ref: getSchemaPath(LoginResponseDto) },
            message: { example: authMessage.success.login },
          },
        },
      ],
    },
  })
  @ApiResponse({
    description: 'Invalid credentials',
    status: HttpStatus.UNAUTHORIZED,
    example: {
      success: false,
      statusCode: 401,
      message: 'Password is incorrect',
      data: null,
      errors: [
        {
          code: 'AUTH_UNAUTHORIZED',
          message: 'Authentication failed',
          field: 'password',
        },
      ],
      requestPath: '/api/v1/auth/email/login',
      timestamp: '2025-06-18T07:08:06.906Z',
    },
  })
  @ApiResponse({
    description: 'Not found email',
    status: HttpStatus.NOT_FOUND,
    example: {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Email address is not registered',
      data: null,
      errors: [
        {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Not found user with user0@gmail.com',
          field: 'email',
          value: 'user0@gmail.com',
        },
      ],
      requestPath: '/api/v1/auth/email/login',
      timestamp: '2025-06-18T07:06:54.269Z',
    },
  })
  @Post(endpoints.loginEmail)
  @HttpCode(HttpStatus.OK)
  async loginByEmail(@Body() credential: AuthLoginDto): Promise<ControllerResponseDto<LoginResponseDto>> {
    const result = await this.authService.loginByEmail(credential);

    if (!result.success) {
      const { errors, message, statusCode } = result;
      throw new DetailedHttpException({ message, errors: [errors] }, statusCode);
    }

    return {
      data: plainToInstance(LoginResponseDto, result.data),
      message: result.message,
    };
  }
}
