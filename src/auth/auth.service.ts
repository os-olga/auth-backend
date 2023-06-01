import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/users/dtos/create-user.dto';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './interfaces/login-response.interface';
import { SignupResponse } from './interfaces/signup-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(body: UserDto): Promise<SignupResponse> {
    const { email, password } = body;
    const existingUser = await this.userService.byEmail(email);

    if (existingUser) {
      throw new BadRequestException(
        'User with this email is already in system',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser({
      ...body,
      password: hashedPassword,
    });

    const tokens = await this.issueTokenPair(String(user._id));
    return {
      message: 'Success',
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async login(body: UserDto): Promise<LoginResponse> {
    const user = await this.validateUser(body);
    const payload = { email: user.email, _id: user._id };

    return {
      message: 'success',
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(body: UserDto): Promise<UserInterface> {
    const user = await this.userService.byEmail(body.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(body.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId };
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });

    return { refreshToken, accessToken };
  }

  returnUserFields(user: UserInterface) {
    return {
      _id: user._id,
      email: user.email,
    };
  }
}
