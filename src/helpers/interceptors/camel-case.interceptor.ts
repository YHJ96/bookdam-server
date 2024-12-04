import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class CamelCaseInterceptor implements NestInterceptor {
  async intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    /* https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c */
    const camelCase = (await import('camelcase-keys')).default;

    return next.handle().pipe(map((data) => camelCase(data, { deep: true })));
  }
}
