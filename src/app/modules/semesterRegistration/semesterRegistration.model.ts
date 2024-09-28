import mongoose, { model } from 'mongoose';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationStatus } from './semesterRegistration.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';

const semesterRegistrationSchema = new mongoose.Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: SemesterRegistrationStatus,
      default: 'UPCOMING',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minCredit: { type: Number, default: 3 },
    maxCredit: { type: Number, default: 16 },
  },
  {
    timestamps: true,
  },
);

semesterRegistrationSchema.pre('save', async function (next) {
  const isAcademicSemesterExist = await AcademicSemesterModel.findById(
    this.academicSemester,
  );

  if (!isAcademicSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Not Exist');
  }
  const isSemesterRegestrationExist = await SemesterRegistrationModel.findOne({
    academicSemester: this.academicSemester,
  });

  if (isSemesterRegestrationExist) {
    throw new AppError(httpStatus.CONFLICT, 'Semester already registered.');
  }
  next();
});

export const SemesterRegistrationModel = model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);
