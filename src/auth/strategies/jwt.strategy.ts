import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PayloadDto } from '../dtos/payload.dto';
import { User } from '../interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.SECRET_KEY}`,
    });
  }

  async validate(payload: PayloadDto): Promise<User> {
    let user;
    if (payload.externalId) {
      user = await this.userService.byExternalId(payload.externalId);
    } else {
      user = await this.userService.byId(payload._id);
    }

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
