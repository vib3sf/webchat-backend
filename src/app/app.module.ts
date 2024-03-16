import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from 'src/messages/messages.module';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    MessagesModule,
    MongooseModule.forRoot('mongodb://localhost/db'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
