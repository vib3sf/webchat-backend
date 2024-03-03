import { Injectable } from '@nestjs/common';
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

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.name === username);
  }
}
