import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnModuleInit {
  @WebSocketServer() server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  sendMessageToClients(content: string, user_name: string, type: string): void {
    this.server.emit('onMessage', {
      message: { type: type, data: { content: content, user_name: user_name } },
    });
  }

  @SubscribeMessage('MessagesChannel')
  handleMessage(@MessageBody() body: any): void {
    console.log(`Recv: ${body}`);
    this.server.emit('onMessage', {
      msg: 'MessageChannel',
      content: body,
    });
  }
}
