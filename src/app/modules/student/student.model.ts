import { Query, Schema, model } from 'mongoose';

import {
  Guardian,
  LocalGuardian,
  StudentInterface,
  StudentMethodsModel,
  UserName,
} from './student.interface';
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
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
      maxlength: [16, 'Password cannot be more than 16 characters'],
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
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicDepertment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepertment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// // Virtual Fiels

studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// // Middleware configuration

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
  delete obj.isDeleted;
  return obj;
};
// // Creating a static method

studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await StudentModel.findOne({ id: id });
  return existingUser;
};

// 3. Create a model using the schema.

export const StudentModel = model<StudentInterface, StudentMethodsModel>(
  'Student',
  studentSchema,
);
