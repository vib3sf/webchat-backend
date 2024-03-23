import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entity/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async findOneByName(username: string): Promise<User> {
    return this.userModel
      .findOne({
        username: username,
      })
      .exec();
  }

  async findOneById(user_id: string): Promise<User> {
    return this.userModel
      .findOne({
        id: user_id,
      })
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
