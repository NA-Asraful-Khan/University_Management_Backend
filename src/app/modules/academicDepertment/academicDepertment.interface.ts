import { Document, Types } from 'mongoose';

export interface TAcademicDepertment extends Document {
  name: string;
  academicFaculty: Types.ObjectId;
}
