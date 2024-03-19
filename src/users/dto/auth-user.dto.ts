import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class AuthUserDto {
  @IsNotEmpty()
  user: {
    name: string;
    id: Types.ObjectId;
  };

  @IsNotEmpty()
  token: string;
}
