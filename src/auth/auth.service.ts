import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {User} from 'src/users/entity/users.entity';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    username: string, 
    pass:     string
  ): Promise<{ token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    return {
      token: await this.getToken(user)
    };
  }

  async register(
    username: string, 
    password: string,
    password_confirm: string
  ): Promise<{ token: string }> {
    if(await this.usersService.findOne(username))
      throw new ConflictException('Username already exist');

    if(password !== password_confirm)
      throw new ConflictException('Password did not match');

    const user = await this.usersService.putOne(username, password);

    return { 
      token: await this.getToken(user)
    };
  }

  private async getToken(user: User) : Promise<any> {
    return this.jwtService.signAsync({ 
      sub: user.id, 
      username: user.name 
    });
  }
}
