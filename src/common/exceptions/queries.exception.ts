import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const error = exception as any;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database query failed';

    if (error.driverError.code === '23505') {
      statusCode = HttpStatus.CONFLICT;
      message = `Unique constraint violated: ${error.driverError.detail}`;
    }

    if (error.driverError.code === '23505') {
      statusCode = HttpStatus.BAD_REQUEST;
      message = `Foreign key constraint failed: ${error.driverError.detail}`;
    }
    res.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.url,
      message,
    });
  }
}
