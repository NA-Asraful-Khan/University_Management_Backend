import { Schema, model } from 'mongoose';
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

const studentSchema = new Schema<StudentInterface, StudentMethodsModel>({
  id: { type: String, required: [true, 'Id is required'] },
  name: {
    type: userNameSchema,
    required: [true, 'Name is required'],
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
});

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
