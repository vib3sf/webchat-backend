import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  user_id: string;

  user_name: string;

  @IsNotEmpty()
  content: string;
}
