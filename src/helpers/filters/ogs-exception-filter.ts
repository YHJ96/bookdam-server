import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

import type ogs from 'open-graph-scraper';

type Og = Awaited<ReturnType<typeof ogs>>;
type OgError = Extract<Og, { error: true }>;

/* https://github.com/jshemas/openGraphScraper/blob/master/lib/request.ts */
@Catch()
export class OgsExceptionFilter extends BaseExceptionFilter {
  catch(exception: OgError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if ('result' in exception && 'requestUrl' in exception.result) {
      const [code, ...text] = exception.result.error.split(' ');

      return response.json({
        message: 'URL 정보를 찾을 수 없습니다.',
        error: text.join(' '),
        statusCode: Number.isNaN(Number(code)) ? 500 : Number(code),
      });
    }

    super.catch(exception, host);
  }
}
