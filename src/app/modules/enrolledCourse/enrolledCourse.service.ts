import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourseModel from './enrolledCourse.model';
import { StudentModel } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { CourseModel } from '../course/course.model';

const createEnrolledCourse = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse } = payload;
  const isOfferedCourseExist = await OfferedCourseModel.findById(offeredCourse);

  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.CONFLICT, 'Offered Course does not exist');
  }

  const course = await CourseModel.findById(isOfferedCourseExist?.course);

  if (isOfferedCourseExist?.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Max capacity reached');
  }

  const student = await StudentModel.findOne({ id: userId }, { _id: 1 });
  if (!student) {
    throw new AppError(httpStatus.CONFLICT, 'Student does not exist');
  }

  const isStudentAlreadyEnrolled = await EnrolledCourseModel.findOne({
    semesterRegistration: isOfferedCourseExist?.semesterRegistration,
    offeredCourse: offeredCourse,
    student: student?._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Already enrolled');
  }
  // Check Credit Limitation
  const semesterRegistration = await SemesterRegistrationModel.findById(
    isOfferedCourseExist?.semesterRegistration,
  ).select('maxCredit');

  const maxCredit = semesterRegistration?.maxCredit;

  const enrolledCourses = await EnrolledCourseModel.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExist?.semesterRegistration,
        student: student?._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  const totalCredits =
    enrolledCourses?.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  if (totalCredits && maxCredit && totalCredits + course?.credits > maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded maximum number of credits',
    );
  }
  // Start session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Create enrolled course
    const result = await EnrolledCourseModel.create(
      [
        {
          semesterRegistration: isOfferedCourseExist?.semesterRegistration,
          academicSemester: isOfferedCourseExist?.academicSemester,
          academicFaculty: isOfferedCourseExist?.academicFaculty,
          academicDepartment: isOfferedCourseExist?.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExist?.course,
          student: student?._id,
          faculty: isOfferedCourseExist?.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create enrolled course',
      );
    }

    const maxCapacity = isOfferedCourseExist?.maxCapacity;

    if (maxCapacity <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Max capacity already zero');
    }

    // Reduce max capacity
    const reduceMaxCapacity = await OfferedCourseModel.findByIdAndUpdate(
      offeredCourse,
      { maxCapacity: maxCapacity - 1, faculty: isOfferedCourseExist?.faculty },
      { session, new: true },
    );

    if (!reduceMaxCapacity) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to reduce capacity',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    // Log detailed error for debugging
    console.error('Error during course enrollment:', error);

    throw new AppError(500, 'Error Enrolling');
  }
};

export const EnrolledCourseServices = {
  createEnrolledCourse,
};
