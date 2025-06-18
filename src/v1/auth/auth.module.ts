import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';

import { AUTH_SERVICE } from './auth-di.token';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
  ],
  exports: [],
})
export class AuthModule {}
