import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { MessagesService } from './messages.service';
import { Message } from './entity/messages.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return await this.messagesService.create(createMessageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @Body() deleteMessageDto: DeleteMessageDto,
    @Param('id') id: string,
  ): Promise<void> {
    console.log(id);
    await this.messagesService.delete(deleteMessageDto, id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async edit(
    @Body() editMessageDto: CreateMessageDto,
    @Param('id') id: string,
  ): Promise<void> {
    await this.messagesService.edit(editMessageDto, id);
  }
}
