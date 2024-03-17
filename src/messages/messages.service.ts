import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entity/messages.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async get() {
    return await this.messageModel.find().exec();
  }

  async create(
    createMessageDto: CreateMessageDto,
    user_id: string,
  ): Promise<Message> {
    createMessageDto.user_id = user_id;
    console.log(createMessageDto);
    const message = await new this.messageModel(createMessageDto).save();
    await this.eventsGateway.sendMessageToClients(
      message.content,
      message.user_name,
    );
    return message;
  }

  async delete(id: string, user_id: string) {
    await this.checkMessage(id, user_id);
    await this.messageModel.deleteOne({ id: id });
    this.eventsGateway.updateMessagesToClients(await this.get(), 'destroy');
  }

  async edit(editMessageDto: CreateMessageDto, id: string, user_id: string) {
    await this.checkMessage(id, user_id);
    await this.messageModel.updateOne(
      { id: id },
      { content: editMessageDto.content },
    );
    this.eventsGateway.updateMessagesToClients(await this.get(), 'update');
  }

  private async checkMessage(id: string, user_id: string) {
    const message = await this.messageModel.findOne({ id: id });
    if (!message) throw new HttpException('No content', HttpStatus.NO_CONTENT);

    console.log(user_id);
    console.log(message.get('user_id'));
    if (user_id !== message.get('user_id').toString())
      throw new ForbiddenException();
  }
}
