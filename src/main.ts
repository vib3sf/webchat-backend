import { NestFactory } from '@nestjs/core';
import {AppModule} from './app/app.module';
import {ConfigService} from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(app.get(ConfigService).get('port'));
}
bootstrap();
