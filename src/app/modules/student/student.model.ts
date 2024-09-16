import { Query, Schema, model } from 'mongoose';

import {
  Guardian,
  LocalGuardian,
  StudentInterface,
  StudentMethodsModel,
  UserName,
} from './student.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
// 2. Create a Schema corresponding to the document interface.
const userNameSchema = new Schema<UserName>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: true },
  contactNo: { type: String, required: true },
  occupation: { type: String, required: true },
  address: { type: String, required: true },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: {
    type: String,
    required: true,
  },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
});

const studentSchema = new Schema<StudentInterface, StudentMethodsModel>(
  {
    id: { type: String, required: [true, 'Id is required'], unique: true },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
      maxlength: [16, 'Password cannot be more than 16 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: true,
    },
    gender: {
      type: String,
      enum: ['female', 'male'],
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: String },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact is Required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Blood Group is required'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is Required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is Required'],
    },
    gurdian: {
      type: guardianSchema,
      required: [true, 'Guardian is required'],
    },
    localGuardians: {
      type: localGuardianSchema,
      required: [true, 'Local Guardians is required'],
    },
    profileImg: { type: String },
    isActive: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// // Virtual Fiels

studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// // Middleware configuration
// Document Middlware configuration
studentSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  // Ensure `isActive` and `isDeleted` fields have default values
  if (!this.isActive) {
    this.isActive = 'active';
  }
  if (this.isDeleted === undefined) {
    this.isDeleted = false;
  }
  next();
});

studentSchema.post('save', function (doc, next) {
  next();
});

// Query Middleware Configuration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
studentSchema.pre<Query<any, any>>(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});

// // Exclude password fields in Response
studentSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.isDeleted;
  return obj;
};
// // Creating a static method

studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await StudentModel.findOne({ id: id });
  return existingUser;
};

// // Creating an custome instance method
// studentSchema.methods.isUserExist = async function (id: string) {
//   const existingUser = await StudentModel.findOne({ id: id });
//   return existingUser;
// };

// 3. Create a model using the schema.

export const StudentModel = model<StudentInterface, StudentMethodsModel>(
  'Student',
  studentSchema,
);
