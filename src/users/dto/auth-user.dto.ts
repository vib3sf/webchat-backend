import { Types } from "mongoose";

export class AuthUserDto {
  user: { name: string, user_id: Types.ObjectId};
  token: string;
}
