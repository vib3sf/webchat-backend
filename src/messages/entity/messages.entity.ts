import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Message {
  @Prop({ type: 'ObjectId', default: () => new Types.ObjectId() })
  id: Types.ObjectId;

  @Prop()
  user_id: Types.ObjectId;

  @Prop()
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
