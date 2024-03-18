import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatService } from './chat.service';
import { Message } from './entity/messages.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @UseGuards(AuthGuard)
  async get(){
    return this.chatService.get();
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createChatDto: CreateMessageDto,
    @Request() req: any,
  ): Promise<Message> {
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
    @Body() editChatDto: CreateMessageDto,
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    await this.chatService.edit(editChatDto, id, req.user.sub);
  }
}
