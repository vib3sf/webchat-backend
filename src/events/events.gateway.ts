import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Message } from 'src/messages/entity/messages.entity';
import { MessagesService } from 'src/messages/messages.service';
import { SendMessageDto } from './dto/send-message';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnModuleInit {
  private logger = new Logger('WebSocketGateway');

  constructor(private readonly messagesService: MessagesService) {}
  @WebSocketServer() server: Server;

  async onModuleInit(): Promise<void> {
    this.server.on('connection', (socket) => {
      this.logger.verbose(`Socket ${socket.id} has been connected`);
    });
  }

  async sendMessageToClients(message: Message): Promise<void> {
    this.server.emit('onMessage', {
      message: {
        type: 'create',
        data: {
          content: message.content,
          user_name: message.user_name,
          id: message.id,
          user_id: message.user_id,
        },
      },
    });
  }

  async updateMessagesToClients(type: string): Promise<void> {
    const data = await this.getSendData();
    this.server.emit('onMessage', {
      message: {
        type: type,
        data: data,
      },
    });
  }

  @SubscribeMessage('Connection')
  async handleMessage(): Promise<void> {
    const data = await this.getSendData();
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

  private async getSendData(): Promise<Array<SendMessageDto>> {
    return (await this.messagesService.findAll()).map((elem: Message) => {
      return {
        content: elem.content,
        user_name: elem.user_name,
        id: elem.id.toString(),
        user_id: elem.user_id.toString(),
      };
    });
  }
}
