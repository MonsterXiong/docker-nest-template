import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // const message =
    //   exception instanceof HttpException
    //     ? exception.message
    //     : '服务器内部错误';
    const message = exception?.message

    console.log(exception);
    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
} 