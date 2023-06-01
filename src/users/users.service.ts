import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './dtos/create-user.dto';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('Users') private userModel: Model<UserInterface>) {}

  async byEmail(email: string): Promise<UserInterface> {
    return await this.userModel.findOne({ email: email });
  }

  async byId(id: string): Promise<UserInterface> {
    return await this.userModel.findOne({ _id: id });
  }

  async byExternalId(id: string): Promise<UserInterface> {
    return await this.userModel.findOne({ externalId: id });
  }

  async createUser(body: UserDto): Promise<UserInterface> {
    const user = new this.userModel({
      ...body,
    });
    return user.save();
  }
}
