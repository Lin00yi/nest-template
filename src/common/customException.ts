import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(code: number, message?: string) {
    super(
      {
        code,
        error: 'CustomException',
        message: message || 'Unknown Error', //|| errorMessages.get(code)
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
