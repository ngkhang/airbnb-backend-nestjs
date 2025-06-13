import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Passport } from 'passport';

import { SwaggerAuthGuard } from './swagger-auth.guard';
import { SwaggerJwtStrategy } from './swagger-jwt.strategy';

@Module({
  imports: [ConfigModule, Passport, JwtModule.register({})],
  controllers: [],
  providers: [
    SwaggerJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: SwaggerAuthGuard,
    },
  ],
})
export class AuthSwaggerModule {}
