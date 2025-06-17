import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/core/database/database.module';

import { UsersRepository } from './infrastructure/persistence/users.repository';
import { USERS_REPOSITORY, USERS_SERVICE } from './users-di.token';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
    },
  ],
  exports: [USERS_SERVICE],
})
export class UsersModule {}
