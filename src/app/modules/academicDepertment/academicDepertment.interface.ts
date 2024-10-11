import { Document, Types } from 'mongoose';

export interface TAcademicDepartment extends Document {
  name: string;
  academicFaculty: Types.ObjectId;
}
