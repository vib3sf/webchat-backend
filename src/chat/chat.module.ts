import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EventsModule } from 'src/events/events.module';
import { ChatController } from './chat.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatService } from './chat.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MessagesModule, AuthModule, EventsModule, UsersModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
