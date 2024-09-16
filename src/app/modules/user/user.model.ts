import { Schema, model } from 'mongoose';
import { UserInterface } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<UserInterface>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
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
      default: 'in-progress',
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

// // Middleware configuration
// Document Middlware configuration
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// // Exclude password fields in Response
userSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.isDeleted;
  return obj;
};
// 3. Create a model using the schema.
export const UserModel = model<UserInterface>('User', userSchema);
