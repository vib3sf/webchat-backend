import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entity/messages.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
  ],

  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
