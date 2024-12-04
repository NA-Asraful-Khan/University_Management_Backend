import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourseModel from './enrolledCourse.model';
import { StudentModel } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

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
      { new: true },
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
    console.log(error);
    throw new AppError(500, 'Error Enrolling');
  }
};

const getMyEnrolledCourses = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const student = await StudentModel.findOne({ id: studentId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourseModel.find({ student: student._id })

      .populate({
        path: 'academicSemester',
        select: 'name year',
      })
      .populate({
        path: 'course',
        select: 'title code', // Exclude _id from course
      })
      .populate({
        path: 'faculty',
        select: 'fullName name ', // Exclude _id from faculty
      })
      .populate({
        path: 'offeredCourse',
        select: 'section days startTime endTime',
      }),

    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const updateEnrolledCourseMarks = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(semesterRegistration);

  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Regestered Semester does not exist',
    );
  }

  const isOfferedCourseExist = await OfferedCourseModel.findById(offeredCourse);

  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course does not exist');
  }

  const isStudentExist = await StudentModel.findById(student);

  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student does not exist');
  }
  const faculty = await FacultyModel.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty does not exist');
  }

  const isCourseBelongToFaculty = await EnrolledCourseModel.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty?._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are Unauthorized');
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm);

    const result = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourseModel.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true },
  );

  return result;
};

const geFacultyCourses = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const faculty = await FacultyModel.findOne({ id: userId });

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  const facultyCoruseQuery = new QueryBuilder(
    EnrolledCourseModel.find(
      { faculty: faculty._id },
      '-faculty -academicSemester -academicFaculty',
    ).populate([
      { path: 'semesterRegistration' },
      { path: 'offeredCourse' },
      { path: 'course' },
      { path: 'academicDepartment' },
      {
        path: 'student',
        select: 'name fullName id _id', // Include only these fields
      },
    ]),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyCoruseQuery.modelQuery;
  const pagination = await facultyCoruseQuery.countTotal();

  return {
    pagination,
    result,
  };
};

export const EnrolledCourseServices = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getMyEnrolledCourses,
  geFacultyCourses,
};
