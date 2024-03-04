import { ConflictException, Injectable } from '@nestjs/common';
import {User} from './entity/users.entity';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      name: 'john',
      password: 'changeme',
    },
    {
      id: 2,
      name: 'maria',
      password: 'guess',
    },
  ];

  private user_count = this.users.length;

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.name === username);
  }

  async putOne(
    username:         string,
    password:         string,
  ): Promise<User> {
    const user = {
      id: ++this.user_count, 
      name: username, 
      password: password
    }

    this.users.push(user)
    return user;
  }
}
