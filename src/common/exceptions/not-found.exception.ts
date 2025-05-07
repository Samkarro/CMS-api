import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus?.() ?? HttpStatus.NOT_FOUND;
    const responseBody = exception.getResponse?.();

    const message =
      typeof responseBody === 'object' && responseBody !== null
        ? (responseBody as any).message
        : this.i18n.t('test.FILTERS.NOT_FOUND.RSRC', {
            lang: I18nContext.current().lang,
          });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: this.i18n.t('test.FILTERS.NOT_FOUND.MESSAGE', {
        lang: I18nContext.current().lang,
      }),
      message,
    });
  }
}
