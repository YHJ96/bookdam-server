import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './apis/app/app.module';
import {
  OgsExceptionFilter,
  PrismaClientExceptionFilter,
} from './helpers/filters';
import { CamelCaseInterceptor } from './helpers/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get('PORT');
  const CLIENT_URL = config.get('CLIENT_URL');

  console.group();
  console.log(config.get('CLIENT_URL'));
  console.log(config.get('CLIENT_REDIRECT_URL'));
  console.log(config.get('KAKAO_CALLBACK_URL'));
  console.log(config.get('GOOGLE_CALLBACK_URL'));
  console.groupEnd();

  app.use(cookieParser());
  app.useGlobalInterceptors(new CamelCaseInterceptor());

  app.enableCors({
    origin: CLIENT_URL,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
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
