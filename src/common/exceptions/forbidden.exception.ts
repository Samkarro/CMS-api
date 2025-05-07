import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus?.() ?? HttpStatus.FORBIDDEN;
    const responseBody = exception.getResponse?.();

    const message =
      typeof responseBody === 'object' && responseBody !== null
        ? (responseBody as any).message
        : this.i18n.t('test.FILTERS.FORBIDDEN.MESSAGE', {
            lang: I18nContext.current().lang,
          });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: this.i18n.t('test.FILTERS.FORBIDDEN.ERROR', {
        lang: I18nContext.current().lang,
      }),
      message,
    });
  }
}
