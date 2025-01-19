import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  private requestLogger = (method: string, url: string) => {
    this.logger.log(
      `[Request] Method: ${method}, URL: ${url}, Time: ${new Date().toISOString()}`,
    );
  };

  private responseLogger = (method: string, url: string, response: object) => {
    const now = Date.now();

    this.logger.log(
      `[Response] Method: ${method}, URL: ${url}, Duration: ${
        Date.now() - now
      }ms, Response: ${JSON.stringify(response)}`,
    );
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    this.requestLogger(method, url);

    return next
      .handle()
      .pipe(tap((response) => this.responseLogger(method, url, response)));
  }
}
