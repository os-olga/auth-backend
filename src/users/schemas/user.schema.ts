import * as mongoose from 'mongoose';

import { UserInterface } from '../interfaces/user.interface';

export const UserSchema = new mongoose.Schema<UserInterface>({
  externalId: String,
  email: String,
  password: String,
});
