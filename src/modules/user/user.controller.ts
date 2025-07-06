import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { ErrorDetailException } from 'src/core/filters/error-detail.exception';
import { APP_TOKEN_KEY } from 'src/core/jwt/jwt.const';
import { ControllerReturnDto } from 'src/shared/dto/controller-response.dto';
import { SuccessResponseDto } from 'src/shared/dto/response.dto';

import { USER_API_CONFIG } from './constants/user.api-config';
import { USER_MESSAGES } from './constants/user.message';
import { UserControllerPort, UserServicePort } from './domain/user.port';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user.dto';
import { UserMapper } from './infrastructure/persistence/user.mapper';
import { USER_SERVICE } from './user-di.token';

const { tagDoc, path, endpoints } = USER_API_CONFIG;

@ApiTags(tagDoc)
@ApiBearerAuth(APP_TOKEN_KEY)
@Controller(path)
export class UserController implements UserControllerPort {
  constructor(@Inject(USER_SERVICE) private readonly userService: UserServicePort) {}

  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiExtraModels(SuccessResponseDto, UserResponseDto)
  @ApiResponse({
    description: 'Successful',
    status: HttpStatus.OK,
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponseDto) },
        {
          properties: {
            statusCode: { example: HttpStatus.OK },
            data: { type: 'array', items: { $ref: getSchemaPath(UserResponseDto) } },
            message: { example: USER_MESSAGES.SUCCESS.DEFAULT },
          },
        },
      ],
    },
  })
  @ApiResponse({
    description: 'Not found',
    status: HttpStatus.NOT_FOUND,
    example: {
      success: false,
      statusCode: 404,
      message: 'Not found user',
      data: null,
      requestPath: '/api/v1/users/email/test%40gmail.com',
      timestamp: '2025-07-03T15:29:28.242Z',
      errors: [
        {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Resource not found',
          field: 'email',
          value: 'test@gmail.com',
        },
      ],
    },
  })
  @Get(endpoints.getAll)
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ControllerReturnDto<UserResponseDto[]>> {
    const results = await this.userService.getAllUsers();

    if (!results.success) {
      throw new ErrorDetailException({ message: results.message, errors: results.errors }, HttpStatus.NOT_FOUND);
    }

    return {
      data: results.data.map((user) => UserMapper.domainToDto(user)),
      message: results.message,
    };
  }

  @ApiOperation({
    summary: 'Get user by email',
  })
  @ApiExtraModels(SuccessResponseDto, UserResponseDto)
  @ApiResponse({
    description: 'Successful',
    status: HttpStatus.OK,
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponseDto) },
        {
          properties: {
            statusCode: { example: HttpStatus.OK },
            data: { $ref: getSchemaPath(UserResponseDto) },
            message: { example: USER_MESSAGES.SUCCESS.DEFAULT },
          },
        },
      ],
    },
  })
  @ApiResponse({
    description: 'Not found',
    status: HttpStatus.NOT_FOUND,
    example: {
      success: false,
      statusCode: 404,
      message: 'Not found user',
      data: null,
      requestPath: '/api/v1/users/email/test%40gmail.com',
      timestamp: '2025-07-03T15:29:28.242Z',
      errors: [
        {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Resource not found',
          field: 'email',
          value: 'test@gmail.com',
        },
      ],
    },
  })
  @Get(endpoints.getByEmail)
  @HttpCode(HttpStatus.OK)
  async findByEmail(@Param('email') email: string): Promise<ControllerReturnDto<UserResponseDto>> {
    const result = await this.userService.getUserByEmail(email);

    if (!result.success) {
      throw new ErrorDetailException({ message: result.message, errors: result.errors }, HttpStatus.NOT_FOUND);
    }

    return {
      data: UserMapper.domainToDto(result.data),
      message: result.message,
    };
  }

  @ApiOperation({
    summary: 'Get user by id',
  })
  @ApiExtraModels(SuccessResponseDto, UserResponseDto)
  @ApiResponse({
    description: 'Successful',
    status: HttpStatus.OK,
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponseDto) },
        {
          properties: {
            statusCode: { example: HttpStatus.OK },
            data: { $ref: getSchemaPath(UserResponseDto) },
            message: { example: USER_MESSAGES.SUCCESS.DEFAULT },
          },
        },
      ],
    },
  })
  @ApiResponse({
    description: 'Not found',
    status: HttpStatus.NOT_FOUND,
    example: {
      success: false,
      statusCode: 404,
      message: 'Not found user',
      data: null,
      requestPath: '/api/v1/users/2150136c-3b16-11f0-9033-0242ac210002',
      timestamp: '2025-07-03T15:26:04.622Z',
      errors: [
        {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Resource not found',
          field: 'id',
          value: '2150136c-3b16-11f0-9033-0242ac210002',
        },
      ],
    },
  })
  @Get(endpoints.getById)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ControllerReturnDto<UserResponseDto>> {
    const result = await this.userService.getUserById(id);

    if (!result.success) {
      throw new ErrorDetailException({ message: result.message, errors: result.errors }, HttpStatus.NOT_FOUND);
    }

    return {
      data: UserMapper.domainToDto(result.data),
      message: result.message,
    };
  }

  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({
    description: 'Successful',
    status: HttpStatus.CREATED,
    example: {
      success: true,
      statusCode: 201,
      message: 'User created successfully',
      data: {
        userId: '84286e73-8fc1-4449-8d22-2e078ec1c189',
      },
      requestPath: '/api/v1/users',
      timestamp: '2025-07-05T07:50:10.223Z',
    },
  })
  @ApiResponse({
    description: 'Conflict',
    status: HttpStatus.CONFLICT,
    example: {
      success: false,
      statusCode: 409,
      message: 'Email already exists',
      data: null,
      requestPath: '/api/v1/users',
      timestamp: '2025-07-04T06:30:35.923Z',
      errors: [
        {
          code: 'RESOURCE_ALREADY_EXISTS',
          message: 'Resource already exists',
          field: 'email',
          value: 'user01@gmail.com',
        },
      ],
    },
  })
  @Post(endpoints.create)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<ControllerReturnDto<{ userId: string }>> {
    const result = await this.userService.createUserByEmail(createUserDto);

    if (!result.success) {
      throw new ErrorDetailException(
        {
          message: result.message,
          errors: result.errors,
        },
        result.statusCode,
      );
    }

    return {
      data: result.data,
      message: result.message,
    };
  }

  @ApiOperation({
    summary: 'Update profile of user',
  })
  @ApiResponse({
    description: 'Successful',
    status: HttpStatus.OK,
    example: {
      success: true,
      statusCode: 200,
      message: 'User updated successfully',
      data: null,
      requestPath: '/api/v1/users/487da24a-7a35-4a48-b477-d67b6412e6f6',
      timestamp: '2025-07-05T07:44:55.981Z',
    },
  })
  @ApiResponse({
    description: 'Not found',
    status: HttpStatus.NOT_FOUND,
    example: {
      success: false,
      statusCode: 404,
      message: 'Not found user',
      data: null,
      requestPath: '/api/v1/users/39ac9d28-7e66-494b-8924-c11e2cac026a',
      timestamp: '2025-07-05T07:44:06.433Z',
      errors: [
        {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Resource not found',
          field: 'id',
          value: '39ac9d28-7e66-494b-8924-c11e2cac026a',
        },
      ],
    },
  })
  @Patch(endpoints.update)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProfileUserDto: UpdateProfileUserDto,
  ): Promise<ControllerReturnDto<null>> {
    const result = await this.userService.updateProfileUser(id, updateProfileUserDto);

    if (!result.success) {
      throw new ErrorDetailException(
        {
          message: result.message,
          errors: result.errors,
        },
        result.statusCode,
      );
    }

    return {
      data: result.data,
      message: result.message,
    };
  }

  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiResponse({
    description: 'Successful',
    status: HttpStatus.OK,
    example: {
      success: true,
      statusCode: 200,
      message: 'User deleted successfully',
      data: null,
      requestPath: '/api/v1/users/487da24a-7a35-4a48-b477-d67b6412e6f6',
      timestamp: '2025-07-05T07:44:55.981Z',
    },
  })
  @ApiResponse({
    description: 'Not found',
    status: HttpStatus.NOT_FOUND,
    example: {
      success: false,
      statusCode: 404,
      message: 'Not found user',
      data: null,
      requestPath: '/api/v1/users/487da24a-7a35-4a48-b477-d67b6412e6f6',
      timestamp: '2025-07-05T07:48:21.019Z',
      errors: [
        {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Resource not found',
          field: 'id',
          value: '487da24a-7a35-4a48-b477-d67b6412e6f6',
        },
      ],
    },
  })
  @Delete(endpoints.delete)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ControllerReturnDto<null>> {
    const result = await this.userService.deleteUser(id);

    if (!result.success) {
      throw new ErrorDetailException(
        {
          message: result.message,
          errors: result.errors,
        },
        result.statusCode,
      );
    }

    return {
      data: null,
      message: result.message,
    };
  }
}
