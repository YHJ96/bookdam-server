import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './apis/app/app.module';
import {
  OgsExceptionFilter,
  PrismaClientExceptionFilter,
} from './helpers/filters';
import {
  CamelCaseInterceptor,
  LoggingInterceptor,
} from './helpers/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get('PORT');
  const CLIENT_URL = config.get('CLIENT_URL');
  const CLIENT_WWW_URL = config.get('CLIENT_WWW_URL');

  app.use(cookieParser());
  app.useGlobalInterceptors(new CamelCaseInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors({
    origin: [CLIENT_URL, CLIENT_WWW_URL],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  /* https://docs.nestjs.com/exception-filters */
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new OgsExceptionFilter(httpAdapter));
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(PORT || 3000);
}

bootstrap();
