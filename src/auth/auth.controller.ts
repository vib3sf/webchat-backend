import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';
import { UsersService } from 'src/users/users.service';
import { Sub } from './auth.decorator';
import {TokenDto} from './dto/token.dto';

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
  async refresh(@Sub() sub: string): Promise<TokenDto> {
    return { 
      token: await this.authService.refresh(await this.userService.findOneById(sub))
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Sub() sub: string) {
    return sub;
  }
}
