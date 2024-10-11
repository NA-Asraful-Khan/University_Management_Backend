import { model, Schema } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';
import { DAYS } from './offeredCourse.constant';

const OfferedCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: 'SemesterRegistration',
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepertment',
      required: true,
    },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', required: true },
    maxCapacity: { type: Number, required: true },
    section: { type: Number, required: true },
    days: [
      {
        type: String,
        enum: DAYS,
      },
    ],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
export const OfferedCourseModel = model<TOfferedCourse>(
  'OfferedCourse',
  OfferedCourseSchema,
);
