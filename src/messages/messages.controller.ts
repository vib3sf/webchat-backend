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
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { Message } from './entity/messages.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any,
  ): Promise<Message> {
    return await this.messagesService.create(createMessageDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
    await this.messagesService.delete(id, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async edit(
    @Body() editMessageDto: CreateMessageDto,
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    await this.messagesService.edit(editMessageDto, id, req.user.sub);
  }
}
