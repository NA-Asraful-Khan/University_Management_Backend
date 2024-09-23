import { Document, Types } from 'mongoose';

export interface TPreRequisiteCourses extends Document {
  course: Types.ObjectId;
  isDeleted: boolean;
}

export interface TCourse extends Document {
  title: string;
  prefix: string;
  code: string;
  credits: number;
  preRequisiteCourses: [];
  isDeleted: boolean;
}
