import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { MessagesService } from './messages.service';
import { Message } from './entity/messages.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messagesService.create(createMessageDto);
  }

  @Delete(':id')
  async delete(
    @Body() deleteMessageDto: DeleteMessageDto,
    @Param('id') id: string,
  ): Promise<void> {
    console.log(id);
    this.messagesService.delete(deleteMessageDto, id);
  }
}
