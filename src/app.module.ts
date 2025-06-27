import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './core/config/app.config';
import { ErrorResponseFilter } from './core/filters/error-response.filter';
import { SuccessResponseInterceptor } from './core/interceptors/success-response.interceptor';
import jwtConfig from './core/jwt/jwt.config';
import { SwaggerAuthModule } from './core/swagger/swagger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, jwtConfig],
      envFilePath: ['.env'],
      cache: true,
    }),
    SwaggerAuthModule,
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
      useClass: ErrorResponseFilter,
    },
  ],
})
export class AppModule {}
