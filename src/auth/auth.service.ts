import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginUserDto): Promise<AuthUserDto> {
    const user = await this.usersService.findOne(loginDto.username);
    if (!verify(user.password, loginDto.password)) {
      this.logger.error(
        `Incorrect login or password for user ${user.username}`,
      );
      throw new UnauthorizedException();
    }

    return {
      user: { name: user.username, id: user.id },
      token: await this.getToken(user),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<void> {
    if (await this.usersService.findOne(createUserDto.username)) {
      this.logger.log(`Username ${createUserDto.username} already exist.`);
      throw new ConflictException('Username already exist');
    }

    if (createUserDto.password !== createUserDto.confirmation_password) {
      this.logger.log('Passwords did not match');
      throw new UnauthorizedException('Passwords did not match');
    }

    createUserDto.password = await hash(createUserDto.password);
    await this.usersService.create(createUserDto);
  }

  private async getToken(user: User): Promise<any> {
    return this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });
  }
}
