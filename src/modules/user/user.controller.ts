import { Controller, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { USER_API_CONFIG } from './constants/user.api-config';
import { UserServicePort } from './domain/user.port';
import { USER_SERVICE } from './user-di.token';

@ApiTags(USER_API_CONFIG.tagDoc)
@Controller(USER_API_CONFIG.path)
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly userService: UserServicePort) {}
}
