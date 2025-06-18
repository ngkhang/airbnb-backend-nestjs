import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';

import { AUTH_SERVICE } from './auth-di.token';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthJwtGuard } from './guards/auth-jwt.guard';
import { AuthJwtStrategy } from './strategies/auth-jwt.strategy';

@Module({
  imports: [ConfigModule, PassportModule, JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthJwtGuard,
    },
    AuthJwtStrategy,
  ],
  exports: [],
})
export class AuthModule {}
