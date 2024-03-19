import { Injectable, Logger } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Message } from 'src/messages/entity/messages.entity';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class ChatService {
  private logger = new Logger('ChatService');

  constructor(
    private readonly messageService: MessagesService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    user_id: string,
  ): Promise<Message> {
    const message = await this.messageService.create(createMessageDto, user_id);
    await this.eventsGateway.sendMessageToClients(
      message.content,
      message.user_name,
    );
    return message;
  }

  async delete(id: string, user_id: string): Promise<void> {
    await this.messageService.delete(id, user_id);
    await this.eventsGateway.updateMessagesToClients('destroy');
  }

  async edit(
    editMessageDto: CreateMessageDto,
    id: string,
    user_id: string,
  ): Promise<void> {
    await this.messageService.edit(editMessageDto, id, user_id);
    await this.eventsGateway.updateMessagesToClients('update');
  }
}
