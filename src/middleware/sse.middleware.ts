// sse.middleware.ts
import { NextFunction, Request, Response } from 'express';
import { SseService } from 'src/modules/sse/sse.service';

export function SseMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path !== '/sse') {
    return next();
  }
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*', // 允许跨域，根据实际需要配置
  });

  const sseService = new SseService(); // 创建 SseService 实例
  const sseStream$ = sseService.getSseStream(); // 获取 SSE 数据流

  const subscription = sseStream$.subscribe({
    next: (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`); // 发送 SSE 事件给客户端
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

  req.on('close', () => {
    console.log('Client closed SSE connection.');
    subscription.unsubscribe(); // 当客户端关闭连接时取消订阅
  });
}
