// sse.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get()
  findAll(): Observable<any> {
    console.log('SseController.findAll');
    return this.sseService.getSseStream();
  }
}
