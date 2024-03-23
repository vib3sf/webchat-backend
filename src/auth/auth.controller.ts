import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) { }

  @Post('login')
  async login(@Body('user') loginDto: LoginUserDto): Promise<AuthUserDto> {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body('user') createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  async refresh(@Request() req: any): Promise<any> {
    return { 
      token: await this.authService.refresh(await this.userService.findOneById(req.user.sub)) 
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
