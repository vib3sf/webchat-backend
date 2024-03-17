import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Message } from 'src/messages/entity/messages.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnModuleInit {
  @WebSocketServer() server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  sendMessageToClients(content: string, user_name: string): void {
    this.server.emit('onMessage', {
      message: {
        type: 'create',
        data: { content: content, user_name: user_name },
      },
    });
  }

  updateMessagesToClients(messages: Array<Message>, type: string): void {
    const data = messages.map((elem: Message) => {
      return { content: elem.content, user_name: elem.user_name };
    });
    this.server.emit('onMessage', {
      message: {
        type: type,
        data: data,
      },
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
