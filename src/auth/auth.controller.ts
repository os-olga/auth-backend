import { UserDto } from 'src/users/dtos/create-user.dto';

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginResponse } from './interfaces/login-response.interface';
import { SignupResponse } from './interfaces/signup-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: UserDto): Promise<SignupResponse> {
    return await this.authService.signup(body);
  }

  @Post('/login')
  async login(@Body() body: UserDto): Promise<LoginResponse> {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getMe(@Request() req) {
    return req.user;
  }
}
