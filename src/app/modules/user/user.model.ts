import { Schema, model } from 'mongoose';
import { UserInterface } from './user.interface';
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<UserInterface>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// 3. Create a model using the schema.
export const UserModel = model<UserInterface>('User', userSchema);
