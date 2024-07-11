import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { CustomException } from './customException';

@Catch() // 捕获所有类型的异常
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    console.log('CustomExceptionFilter.catch', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    const errorResponse = {
      code: exception.getResponse()['code'],
      // timestamp: new Date().toISOString(),
      // path: request.url,
      // method: request.method,
      message: exception.getResponse()['message'],
      data: null,
      success: false,
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
