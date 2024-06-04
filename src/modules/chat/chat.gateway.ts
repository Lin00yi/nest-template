import {
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface RoomUser {
  id: string;
  username: string;
}

@WebSocketGateway(8090, { transports: ['websocket'], namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private rooms: { [key: string]: Set<RoomUser> } = {};

  // 服务器端执行加入房间操作的内部方法
  private handleJoinRoomInternal(client: Socket, room: string) {
    console.log('join', room, client.join);
    client.join(room);
    this.server.to(room).emit('userJoined', { userId: client.id });
  }

  afterInit(server: Server) {
    console.log('WebSocket服务器初始化完毕', typeof server);
  }

  handleConnection(client: Socket) {
    console.log('客户端已连接:', client);
  }

  handleDisconnect(client: Socket) {
    console.log('客户端已断开连接:', client);
    // Remove client from all rooms they were in
    for (const room in this.rooms) {
      const users = this.rooms[room];
      for (const user of users) {
        if (user.id === client.id) {
          users.delete(user);
          break;
        }
      }
      if (users.size === 0) {
        delete this.rooms[room];
      }
    }
  }

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() data: { room: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('----client----', client);
    const { room, username } = data;
    console.log('----data----', data);
    if (!this.rooms[room]) {
      this.rooms[room] = new Set();
    }

    const isUsernameTaken = Array.from(this.rooms[room]).some(
      (user) => user.username === username,
    );
    console.log('----isUsernameTaken----', isUsernameTaken);
    if (isUsernameTaken) {
      client.emit('error', { message: 'Username already taken in this room.' });
      console.log(
        `Client ${client.id} tried to join room ${room} with a taken username: ${username}`,
      );
      return;
    }
    console.log(
      '----this.rooms[room]----',
      this.rooms[room],
      client.id,
      username,
    );
    this.rooms[room].add({ id: client.id, username });

    // 发送加入房间消息给服务器端
    this.handleJoinRoomInternal(client, room);

    // client.join(room);
    // this.server.to(room).emit('userJoined', { userId: client.id, username });
    // console.log(`Client ${client.id} joined room ${room} as ${username}`);
  }

  @SubscribeMessage('leave')
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room } = data;

    if (this.rooms[room]) {
      const users = this.rooms[room];
      for (const user of users) {
        if (user.id === client.id) {
          users.delete(user);
          break;
        }
      }
      if (users.size === 0) {
        delete this.rooms[room];
      }
    }
    client.leave(room);
    this.server.to(room).emit('userLeft', { userId: client.id });
    console.log(`Client ${client.id} left room ${room}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, message } = data;
    this.server.to(room).emit('message', { userId: client.id, message });
    console.log(`Client ${client.id} sent message to room ${room}: ${message}`);
  }
}
