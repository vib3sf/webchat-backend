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

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    user_id: string,
  ): Promise<Message> {
    createMessageDto.user_id = user_id;
    console.log(createMessageDto);
    return await new this.messageModel(createMessageDto).save();
  }

  async delete(id: string, user_id: string) {
    await this.checkMessage(id, user_id);
    await this.messageModel.deleteOne({ id: id });
  }

  async edit(editMessageDto: CreateMessageDto, id: string, user_id: string) {
    await this.checkMessage(id, user_id);
    await this.messageModel.updateOne(
      { id: id },
      { content: editMessageDto.content },
    );
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
