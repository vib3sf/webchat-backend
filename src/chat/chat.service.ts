import { Injectable, Logger } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { Message } from 'src/messages/entity/messages.entity';
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  private logger = new Logger('ChatService');

  constructor(
    private readonly messageService: MessagesService,
    private readonly eventsGateway: EventsGateway,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createChatDto: CreateChatDto,
    user_id: string,
  ): Promise<Message> {
    const user = await this.usersService.findOneById(user_id);
    const message = await this.messageService.create(
      {
        user_name: user.username,
        user_id: user.id.toString(),
        content: createChatDto.content,
      },
      user_id,
    );
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
    editChatDto: CreateChatDto,
    id: string,
    user_id: string,
  ): Promise<void> {
    await this.messageService.edit(editChatDto.content, id, user_id);
    await this.eventsGateway.updateMessagesToClients('update');
  }
}
