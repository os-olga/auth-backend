import { Strategy } from 'passport';
import { UserDto } from 'src/users/dtos/create-user.dto';
import { UserInterface } from 'src/users/interfaces/user.interface';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(data: UserDto): Promise<UserInterface> {
    const user = await this.authService.validateUser(data);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
