import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { APP_TOKEN } from 'src/core/jwt/jwt.const';
import { SuccessMessages } from 'src/shared/constant/message';
import { authResource } from 'src/shared/constant/resource-endpoints';
import { SkipAuth } from 'src/shared/decorators/skip-auth.decorator';
import { ControllerResponseDto } from 'src/shared/dtos/controller.dto';
import { SuccessResponseDto } from 'src/shared/dtos/response.dto';
import { DetailedHttpException } from 'src/shared/filter/detailed-http.exception';

import { AuthLoginDto } from './application/dto/auth-login.dto';
import { AuthRegisterDto } from './application/dto/auth-register.dto';
import { LoginResponseDto } from './application/dto/login-response.dto';
import { RegisterResponseDto } from './application/dto/register-response.dto';
import { AUTH_SERVICE } from './auth-di.token';
import { AuthControllerPort } from './domain/ports/auth-controller.port';
import { AuthServicePort } from './domain/ports/auth-service.port';

const { tagDoc, prefix, endpoints } = authResource;

@ApiTags(tagDoc)
@ApiBasicAuth(APP_TOKEN)
@SkipAuth()
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
            message: { example: SuccessMessages.LOGIN },
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
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Password is incorrect',
      data: null,
      errors: {
        code: 'AUTH_UNAUTHORIZED',
        message: 'Password compare failed',
        field: 'password',
      },
      requestPath: '/api/v1/auth/email/login',
      timestamp: '2025-06-20T12:45:07.627Z',
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
      errors: {
        code: 'RESOURCE_NOT_FOUND',
        message: 'Not found user with users01@gmail.com',
        field: 'email',
        value: 'users01@gmail.com',
      },
      requestPath: '/api/v1/auth/email/login',
      timestamp: '2025-06-20T12:45:32.088Z',
    },
  })
  @Post(endpoints.loginEmail)
  @HttpCode(HttpStatus.OK)
  async loginByEmail(@Body() credential: AuthLoginDto): Promise<ControllerResponseDto<LoginResponseDto>> {
    const res = await this.authService.loginByEmail(credential);

    if (!res.success) {
      const { errors, message, statusCode } = res;
      throw new DetailedHttpException({ message, errors }, statusCode);
    }

    return {
      data: plainToInstance(LoginResponseDto, res.data),
      message: res.message,
    };
  }

  @ApiOperation({
    summary: 'Register by email and password',
  })
  @ApiExtraModels(SuccessResponseDto, RegisterResponseDto)
  @ApiResponse({
    description: 'Successful',
    status: HttpStatus.CREATED,
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponseDto) },
        {
          properties: {
            statusCode: { example: HttpStatus.CREATED },
            data: { $ref: getSchemaPath(RegisterResponseDto) },
            message: { example: SuccessMessages.REGISTER },
          },
        },
      ],
    },
  })
  @ApiResponse({
    description: 'Email is already registered',
    status: HttpStatus.CONFLICT,
    example: {
      success: false,
      statusCode: HttpStatus.CONFLICT,
      message: 'An account with this email address already exists',
      data: null,
      errors: {
        code: 'RESOURCE_CONFLICT',
        message: 'Resource conflict email',
        field: 'email',
        value: 'users01@gmail.com',
      },
      requestPath: '/api/v1/auth/email/register',
      timestamp: '2025-06-20T12:48:09.086Z',
    },
  })
  @Post(endpoints.registerEmail)
  @HttpCode(HttpStatus.CREATED)
  async registerByEmail(@Body() registerDto: AuthRegisterDto): Promise<ControllerResponseDto<RegisterResponseDto>> {
    const res = await this.authService.registerByEmail(registerDto);

    if (!res.success) {
      const { errors, message, statusCode } = res;

      throw new DetailedHttpException({ message, errors }, statusCode);
    }

    return {
      data: res.data,
      message: res.message,
    };
  }
}
