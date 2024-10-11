/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema, Types } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';
import { DAYS } from './offeredCourse.constant';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartmentModel } from '../academicDepertment/academicDepertment.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';

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
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
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

async function checkDocumentExists(
  model: any,
  id: Types.ObjectId | string,
  errorMessage: string,
) {
  const document = await model.findById(id);
  if (!document) {
    throw new AppError(httpStatus.NOT_FOUND, `${errorMessage} not found!`);
  }
}

OfferedCourseSchema.pre('save', async function (next) {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
  } = this;

  // Fetch the semesterRegistration document to get academicSemester
  const semesterRegistrationDoc = await SemesterRegistrationModel.findById({
    _id: semesterRegistration,
  });
  if (!semesterRegistrationDoc) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found!',
    );
  }

  // Set academicSemester to the one in semesterRegistration
  this.academicSemester = semesterRegistrationDoc?.academicSemester;

  // Perform the rest of the checks
  await Promise.all([
    checkDocumentExists(
      AcademicFacultyModel,
      academicFaculty,
      'Academic Faculty',
    ),
    checkDocumentExists(
      AcademicDepartmentModel,
      academicDepartment,
      'Academic Department',
    ),
    checkDocumentExists(CourseModel, course, 'Course'),
    checkDocumentExists(FacultyModel, faculty, 'Faculty'),
  ]);
  // check if the department is belowng to the faculty
  const isDepertmentBelongToFaculty = await AcademicDepartmentModel.findOne({
    academicFaculty,
    _id: academicDepartment,
  });
  if (!isDepertmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Depertment ${academicDepartment} is not belong to this Faculty ${academicFaculty}`,
    );
  }

  // check if the same course same section in some registered semester exists

  const isSameOfferedCourseExistsWithSameRegSemWithSameSection =
    await OfferedCourseModel.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegSemWithSameSection) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Offered Course with same section is already exist!`,
    );
  }
  next();
});

export const OfferedCourseModel = model<TOfferedCourse>(
  'OfferedCourse',
  OfferedCourseSchema,
);
