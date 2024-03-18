import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [MessagesModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
