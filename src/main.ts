import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { OgsExceptionFilter } from './helper/filters/ogs-exception-filter';
import { PrismaClientExceptionFilter } from './helper/filters/prisma-client-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  await app.listen(8080);
}

bootstrap();
