import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Controller('')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('user') loginDto: LoginUserDto) {
    const authUser = await this.authService.login(loginDto);
    this.logger.verbose(`User ${loginDto.username} has been authorized`);
    return authUser;
  }

  @Post('register')
  async register(@Body('user') createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    this.logger.verbose(`User ${createUserDto.username} has been registered`);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
