import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { Message } from 'src/messages/entity/messages.entity';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnModuleInit {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) {}
  @WebSocketServer() server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  async sendMessageToClients(
    content: string,
    user_name: string,
  ): Promise<void> {
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

  @SubscribeMessage('Connection')
  async handleMessage(@MessageBody() body: any): Promise<void> {
    const messages = await this.messageModel.find().exec();
    const data = messages.map((elem: Message) => {
      return { content: elem.content, user_name: elem.user_name };
    });
    console.log(`Recv: ${body}`);
    this.server.emit(
      'onMessage',
      this.server.emit('onMessage', {
        message: {
          type: 'connection',
          data: data,
        },
      }),
    );
  }
}
