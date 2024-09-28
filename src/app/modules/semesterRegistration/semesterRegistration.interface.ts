import { Document, Types } from 'mongoose';

export interface TSemesterRegistration extends Document {
  academicSemester: Types.ObjectId;
  status: 'UPCOMING' | 'ONGOING' | 'ENDED';
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
}
