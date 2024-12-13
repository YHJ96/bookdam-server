import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

/* https://www.prisma.io/docs/orm/reference/error-reference */
/* https://www.prisma.io/blog/nestjs-prisma-error-handling-7D056s1kOop2 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    const { NOT_FOUND } = HttpStatus;

    switch (exception.code) {
      case 'P2025': {
        return response
          .status(NOT_FOUND)
          .json({ statusCode: NOT_FOUND, message });
      }
      default: {
        console.error('exception.code', exception.code);
        super.catch(exception, host);
      }
    }
  }
}
