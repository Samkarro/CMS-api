import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus?.() ?? HttpStatus.BAD_REQUEST;
    const responseBody = exception.getResponse?.();

    let validationErrors: string[] = [];

    if (
      typeof responseBody === 'object' &&
      responseBody !== null &&
      'message' in responseBody
    ) {
      const message = (responseBody as any).message;
      if (Array.isArray(message)) {
        validationErrors = message;
      } else {
        validationErrors.push(message);
      }
    }

    const lang = req.headers['accept-language'] || 'en';

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      error: this.i18n.t('test.FILTERS.BAD_REQUEST.ERROR', {
        lang,
      }),
      message: this.i18n.t('test.FILTERS.BAD_REQUEST.MESSAGE', {
        lang,
      }),
      details: validationErrors,
    });
  }
}
