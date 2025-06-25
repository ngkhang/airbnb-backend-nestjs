import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { envKeys, EnvKeys } from '../config/env-keys';

import { SwaggerAuthGuard } from './swagger-auth.guard';
import { SwaggerJwtStrategy } from './swagger-jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvKeys>) => {
        const { jwtIssuer, jwtSwaggerExpiresIn } = configService.getOrThrow(envKeys.jwt, {
          infer: true,
        });
        return {
          signOptions: {
            issuer: jwtIssuer,
            expiresIn: jwtSwaggerExpiresIn,
          },
          verifyOptions: {
            issuer: jwtIssuer,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    SwaggerJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: SwaggerAuthGuard,
    },
  ],
})
export class SwaggerAuthModule {}
