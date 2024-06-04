import { Module } from '@nestjs/common';
import { WebsocketsGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  providers: [WebsocketsGateway, WebsocketService],
})
export class WebsocketModule {}
