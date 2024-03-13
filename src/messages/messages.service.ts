import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entity/messages.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteMessageDto } from './dto/delete-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    console.log(createMessageDto);
    return await new this.messageModel(createMessageDto).save();
  }

  async delete(deleteMessageDto: DeleteMessageDto, id: string) {
    console.log(deleteMessageDto);
    await this.messageModel.deleteOne({ id: id });
  }

  async edit(editMessageDto: CreateMessageDto, id: string) {
    await this.messageModel.updateOne(
      { id: id },
      { content: editMessageDto.content },
    );
  }
}
