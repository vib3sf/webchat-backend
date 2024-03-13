import { Types } from 'mongoose';

export class AuthUserDto {
  user: { name: string; id: Types.ObjectId };
  token: string;
}
