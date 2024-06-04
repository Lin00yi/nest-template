// sse.service.ts
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
interface ServerSentEvent<T = any> {
  data: T;
  id?: string;
  type?: string;
  retry?: number;
}

@Injectable()
export class SseService {
  getSseStream(): Observable<ServerSentEvent> {
    return new Observable((observer) => {
      // 模拟数据源
      setInterval(() => {
        console.log('SseService.getSseStream');
        const data = { message: 'Hello, SSE!' };
        observer.next({ data: JSON.stringify(data) });
      }, 2000);
    });
  }
}
