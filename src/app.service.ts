import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(session: Record<string, any>): string {
    if (session.visits) {
      session.visits++;
    } else {
      session.visits = 1;
    }
    return `该页面被访问了 ${session.visits} 次`;
  }
}
