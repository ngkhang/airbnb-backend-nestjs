import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './core/config/app.config';
import { DatabaseModule } from './core/database/database.module';
import { ErrorResponseExceptionFilter } from './shared/filters/error-response.filter';
import { SuccessResponseInterceptor } from './shared/interceptors/success-response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfig],
      cache: true,
    }),
    DatabaseModule,
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
