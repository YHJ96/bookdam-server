import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { OgsExceptionFilter } from './helper/filters/ogs-exception-filter';
import { PrismaClientExceptionFilter } from './helper/filters/prisma-client-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get('PORT');
  const CLIENT_URL = config.get('CLIENT_URL');

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
