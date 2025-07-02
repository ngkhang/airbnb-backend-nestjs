import { Inject, Injectable } from '@nestjs/common';

import { UserRepositoryPort, UserServicePort } from './domain/user.port';
import { USER_REPOSITORY } from './user-di.token';

@Injectable()
export class UserService implements UserServicePort {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort) {}
}
