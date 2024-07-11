import { Injectable } from '@nestjs/common';
import { Result } from './result';
import { ResultMessage } from './resultEnum';
import { ResultStatus } from './resultConstant';

@Injectable()
export class ResultService {
  static success<T>(msg?: string, data: T = null): Result<T> {
    const result = new Result<T>();
    result.success = true;
    result.code = 20000;
    result.msg = msg || 'Success';
    result.data = data;
    return result;
  }

  static failure<T>(msg?: string, data?: T): Result<T> {
    const result = new Result<T>();
    result.success = false;
    result.code = ResultStatus.FAILURE;
    result.msg = msg || ResultMessage[903];
    result.data = data || null;
    return result;
  }

  static result<T>(
    success: boolean,
    code: number,
    msg: string,
    data?: T,
  ): Result<T> {
    const result = new Result<T>();
    result.success = success;
    result.code = code;
    result.msg = msg;
    result.data = data;
    return result;
  }
}
