import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Message } from 'src/messages/entity/messages.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  private logger = new Logger('MessagesService');

  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) {}

  async findAll() {
    return await this.messageModel.find().exec();
  }

  async create(
    createMessageDto: CreateMessageDto,
    user_id: string,
  ): Promise<Message> {
    createMessageDto.user_id = user_id;
    this.logger.verbose(
      `Message has been created. 
      user_id: ${createMessageDto.user_id}, 
      user_name: ${createMessageDto.user_name}, 
      content: ${createMessageDto.content}`,
    );
    const message = await new this.messageModel(createMessageDto).save();
    return message;
  }

  async delete(id: string, user_id: string) {
    await this.checkMessage(id, user_id);
    await this.messageModel.deleteOne({ id: id });
    this.logger.verbose(
      `Message has been deleteted.
      id: ${id},
      user_id: ${user_id}`,
    );
  }

  async edit(editContent: string, id: string, user_id: string) {
    await this.checkMessage(id, user_id);
    await this.messageModel.updateOne({ id: id }, { content: editContent });
    this.logger.verbose(
      `Message has been updated.
      id: ${id},  
      content: ${editContent}`,
    );
  }

  private async checkMessage(id: string, user_id: string) {
    const message = await this.messageModel.findOne({ id: id });
    if (!message) {
      this.logger.error(`
      Message is not found.
      id: ${id},
      user_id: ${user_id}`);
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    if (user_id !== message.get('user_id').toString()) {
      this.logger.error(
        `Forbidden.
        id: ${id},
        user_id: ${user_id}`,
      );
      throw new ForbiddenException();
    }
  }
}
