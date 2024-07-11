// sse.service.ts
import { Injectable } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Injectable()
export class SseService {
  // 方法一：直接使用 new Observable 创建一个自定义的 Observable 对象，手动管理数据生成和清理。
  // 在 Observable 完成或取消订阅时，清理通过 clearInterval 停止生成数据的定时器。
  // getSseStream(): Observable<ServerSentEvent> {
  //   return new Observable((observer) => {
  //     // 模拟数据源
  //     const timeout = setInterval(() => {
  //       console.log('SseService.getSseStream');
  //       const data = { message: 'Hello, SSE!' };
  //       observer.next({ data: JSON.stringify(data) });
  //     }, 2000);
  //     return () => {
  //       console.log('SseService.getSseStream complete');
  //       timeout && clearInterval(timeout);
  //       //结束时清理
  //     };
  //   });
  // }

  // 方法二：使用 RxJS 提供的 interval 和 pipe 运算符，生成一个基于时间间隔的流，并通过 map 运算符变换数据。
  // interval 内部已经处理了清理机制，无需手动清理。
  getSseStream(): Observable<any> {
    // throw new CustomException(ResultStatus.FAILURE, 'getSseStream error'); // 测试异常处理
    return interval(1000).pipe(map((i) => ({ data: `Message ${i}` })));
  }
}
