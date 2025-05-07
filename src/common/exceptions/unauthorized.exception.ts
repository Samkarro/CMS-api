import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus?.() ?? HttpStatus.UNAUTHORIZED;
    const responseBody = exception.getResponse?.();

    // Extracting the error messages if they exist
    const message =
      typeof responseBody === 'object' && responseBody !== null
        ? (responseBody as any).message
        : this.i18n.t('test.FILTERS.UNAUTHORIZED.MESSAGE', {
            lang: I18nContext.current().lang,
          });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: this.i18n.t('test.FILTERS.UNAUTHORIZED.ERROR', {
        lang: I18nContext.current().lang,
      }),
      message,
    });
  }
}
