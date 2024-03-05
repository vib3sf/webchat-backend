import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {LoginUserDto} from 'src/users/dto/login-user.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body('user') loginDto: LoginUserDto) {
    return this.authService.login(
      loginDto
    );
  }

  @Post('register')
  register(@Body('user') createUserDto: CreateUserDto) {
    return this.authService.register(
      createUserDto
    );
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
