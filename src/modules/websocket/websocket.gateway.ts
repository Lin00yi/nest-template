import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8082)
// @WebSocketGateway(8082, { namespace: '/hq' })
export class WebsocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket服务器初始化完毕 (HQ)', server);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected (HQ):', client.id);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected (HQ):', client, args);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    console.log('Received message from client (HQ):', data);
    return 'Hello from server (HQ)';
  }
}
