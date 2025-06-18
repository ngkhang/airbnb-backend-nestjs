import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './core/config/app.config';
import { DatabaseModule } from './core/database/database.module';
import jwtConfig from './core/jwt/jwt.config';
import { AuthSwaggerModule } from './core/swagger/swagger.module';
import { ErrorResponseExceptionFilter } from './shared/filter/error-response.filter';
import { SuccessResponseInterceptor } from './shared/interceptors/success-response.interceptor';
import { AuthModule } from './v1/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, jwtConfig],
      envFilePath: ['.env'],
      cache: true,
    }),
    DatabaseModule,
    AuthSwaggerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorResponseExceptionFilter,
    },
  ],
})
export class AppModule {}
