import { Injectable } from '@nestjs/common';
import { Result } from './result';
import { ResultMessage } from './resultEnum';
import { ResultStatus } from './resultConstant';

@Injectable()
export class ResultService {
  static success<T>(message?: string, data: T = null): Result<T> {
    const result = new Result<T>();
    result.success = true;
    result.code = ResultStatus.SUCCESS;
    result.message = message || 'Success';
    result.data = data;
    return result;
  }

  static failure<T>(message?: string, data?: T): Result<T> {
    const result = new Result<T>();
    result.success = false;
    result.code = ResultStatus.FAILURE;
    result.message = message || ResultMessage[903];
    result.data = data || null;
    return result;
  }

  static result<T>(
    success: boolean,
    code: number,
    message: string,
    data?: T,
  ): Result<T> {
    const result = new Result<T>();
    result.success = success;
    result.code = code;
    result.message = message;
    result.data = data;
    return result;
  }
}
