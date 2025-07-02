import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/core/prisma/prisma.module';

import { UserRepository } from './infrastructure/persistence/user.repository';
import { USER_REPOSITORY, USER_SERVICE } from './user-di.token';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    { provide: USER_SERVICE, useClass: UserService },
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [USER_SERVICE],
})
export class UserModule {}
