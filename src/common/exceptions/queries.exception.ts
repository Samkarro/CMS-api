import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const error = exception as any;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = this.i18n.t('test.FILTERS.QUERIES.QUERY_FAIL', {
      lang: I18nContext.current().lang,
    });

    if (error.driverError.code === '23505') {
      statusCode = HttpStatus.CONFLICT;
      message =
        this.i18n.t('test.FILTERS.QUERIES.UNIQUE_FAIL', {
          lang: I18nContext.current().lang,
        }) + `${error.driverError.detail}`;
    }

    if (error.driverError.code === '23503') {
      statusCode = HttpStatus.BAD_REQUEST;
      message =
        this.i18n.t('test.FILTERS.QUERIES.FK_FAIL', {
          lang: I18nContext.current().lang,
        }) + `${error.driverError.detail}`;
    }
    res.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.url,
      message,
    });
  }
}
