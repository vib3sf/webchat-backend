import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginUserDto): Promise<AuthUserDto> {
    const user = await this.usersService.findOne(loginDto.username);
    if (user?.password !== loginDto.password) throw new UnauthorizedException();

    return {
      user: { name: user.username, user_id: user.id },
      token: await this.getToken(user),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<void> {
    if (await this.usersService.findOne(createUserDto.username))
      throw new ConflictException('Username already exist');

    if (createUserDto.password !== createUserDto.confirmation_password)
      throw new ConflictException('Passwords did not match');

    await this.usersService.create(createUserDto);
  }

  private async getToken(user: User): Promise<any> {
    return this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });
  }
}
