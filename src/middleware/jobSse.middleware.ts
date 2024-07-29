import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JobService } from 'src/modules/job/job.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class JobSseMiddleware implements NestMiddleware {
  constructor(
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 如果请求路径不是 /job/spider/start，则继续处理下一个中间件
    if (req.path !== '/job/spider/start') {
      return next();
    }

    // 设置SSE响应头
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*', // 允许跨域，根据实际需要配置
    });

    // 从请求的查询参数中提取 query 和 city
    const { query, city } = req.query;

    // 实例化 JobService
    const jobService = new JobService(this.entityManager);

    // 获取 SSE 数据流
    const sseStream$ = jobService.getSseStream(
      query as string,
      city as string | number,
    );

    // 订阅数据流
    const subscription = sseStream$.subscribe({
      next: (data) => {
        // 发送 SSE 事件给客户端
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      },
      error: (error) => {
        console.error('SSE Error:', error);
        res.end(); // 如果发生错误，结束 SSE 连接
      },
      complete: () => {
        console.log('SSE Connection closed.'); // SSE 连接关闭时的处理
        res.end();
      },
    });

    // 当客户端关闭连接时取消订阅
    req.on('close', () => {
      console.log('Client closed SSE connection.');
      subscription.unsubscribe();
    });
  }
}
