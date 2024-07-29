import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { SseService } from 'src/modules/sse/sse.service';
import { JobService } from 'src/modules/job/job.service';
import { ssePath } from 'src/constants';
import { hasQueryParams } from 'src/utils';

@Injectable()
export class SseMiddleware implements NestMiddleware {
  constructor(
    @Inject(SseService) private readonly sseService: SseService,
    @Inject(JobService) private readonly jobService: JobService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*', // 允许跨域，根据实际需要配置
    });

    const hasQuery = hasQueryParams(req.originalUrl); //是否有query参数
    const path = hasQuery ? req.originalUrl.split('?')[0] : req.originalUrl;

    if (path !== ssePath.sse && path !== ssePath.jobSpiderStart) {
      return next();
    }

    let sseStream$;

    if (path === ssePath.sse) {
      sseStream$ = this.sseService.getSseStream();
    } else if (path === ssePath.jobSpiderStart) {
      const { query, city } = req.query;
      console.log('query:', query, 'city:', city);
      sseStream$ = this.jobService.getSseStream(
        query as string,
        city as string | number,
      );
    }

    if (!sseStream$) {
      return res.status(500).send('Stream not available');
    }

    const subscription = sseStream$.subscribe({
      next: (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      },
      error: (error) => {
        console.error('SSE Error:', error);
        res.end();
      },
      complete: () => {
        console.log('SSE Connection closed.');
        res.end();
      },
    });

    req.on('close', async () => {
      console.log('Client closed SSE connection.');
      subscription.unsubscribe();
    });
  }
}
