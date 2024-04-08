import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        code: exception.getStatus(),
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        errors: 'validation errors',
        log: exception.message,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: exception.message,
      });
    }
  }
}
