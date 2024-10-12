import { Document } from 'mongoose';

export interface TLoginUser extends Document {
  id: string;
  password: string;
}
