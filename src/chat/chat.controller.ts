import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from 'src/messages/entity/messages.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';
import { Sub } from 'src/auth/auth.decorator';

@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createChatDto: CreateChatDto,
    @Sub() sub: string,
  ): Promise<Message> {
    console.log('create');
    return await this.chatService.create(createChatDto, sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string, @Sub() sub: string): Promise<void> {
    await this.chatService.delete(id, sub);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async edit(
    @Body() editChatDto: CreateChatDto,
    @Param('id') id: string,
    @Sub() sub: string,
  ): Promise<Message> {
    return await this.chatService.edit(editChatDto, id, sub);
  }
}
