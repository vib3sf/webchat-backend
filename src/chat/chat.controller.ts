import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from 'src/messages/entity/messages.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createChatDto: CreateChatDto,
    @Request() req: any,
  ): Promise<Message> {
    console.log('create');
    return await this.chatService.create(createChatDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
    await this.chatService.delete(id, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async edit(
    @Body() editChatDto: CreateChatDto,
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    await this.chatService.edit(editChatDto, id, req.user.sub);
  }
}
