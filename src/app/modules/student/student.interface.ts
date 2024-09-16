// 1. Create an interface representing a document in MongoDB.

import { Model, Types } from 'mongoose';

export type Guardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type UserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type LocalGuardian = {
  name: string;
  contactNo: string;
  occupation: string;
  address: string;
};

export type StudentInterface = {
  id: string;
  user: Types.ObjectId;
  name: UserName;
  password: string;
  gender: 'male' | 'female';
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  gurdian: Guardian;
  localGuardians: LocalGuardian;
  profileImg?: string;
  isDeleted?: boolean;
};
// For Creating Static Methods
export interface StudentMethodsModel extends Model<StudentInterface> {
  // eslint-disable-next-line no-unused-vars
  isUserExist(id: string): Promise<StudentInterface | null>;
}

// For Creating Instance Methods
// export type StudentMethods = {
//   // eslint-disable-next-line no-unused-vars
//   isUserExist(id: string): Promise<StudentInterface | null>;
// };

// export type StudentMethodsModel = Model<
//   StudentInterface,
//   Record<string, never>,
//   StudentMethods
// >;
