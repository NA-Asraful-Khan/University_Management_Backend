import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { BaseRepository } from '../base/base.repository';
import { StudentModel } from '../student/student.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourseModel } from './offeredCourse.model';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';

export class OfferedCourseRepository extends BaseRepository<TOfferedCourse> {
  constructor() {
    super(OfferedCourseModel);
  }

  async findAll(): Promise<TOfferedCourse[]> {
    return this.model
      .find()
      .populate({
        path: 'academicSemester',
        select: 'name year -_id', // Exclude _id from academicSemester
      })
      .populate({
        path: 'semesterRegistration',
        select: 'status -_id',
        populate: { path: 'academicSemester', select: 'name year -_id' }, // Exclude _id from semesterRegistration
      })
      .populate({
        path: 'academicFaculty',
        select: 'name -_id', // Exclude _id from academicFaculty
      })
      .populate({
        path: 'academicDepartment',
        select: 'name -_id', // Exclude _id from academicDepartment
      })
      .populate({
        path: 'course',
        select: 'title -_id', // Exclude _id from course
      })
      .populate({
        path: 'faculty',
        select: 'fullName name -_id', // Exclude _id from faculty
      })
      .select('-__v') // Exclude __v from the root document
      .exec();
  }

  async myOfferedCourse(userId: string): Promise<TOfferedCourse[]> {
    const student = await StudentModel.findOne({ id: userId });

    if (!student) {
      throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }

    const currentOngoingSemester = await SemesterRegistrationModel.findOne({
      status: 'ONGOING',
    });
    if (!currentOngoingSemester) {
      throw new AppError(httpStatus.NOT_FOUND, 'No Ongoing Semester');
    }
    const result = await OfferedCourseModel.aggregate([
      {
        $match: {
          semesterRegistration: currentOngoingSemester?._id,
          academicFaculty: student.academicFaculty,
          academicDepartment: student.academicDepartment,
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: '$course',
      },
      {
        $lookup: {
          from: 'enrolledcourses',
          let: {
            currentOngoingSemester: currentOngoingSemester?._id,
            currentStudentId: student._id,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        '$semesterRegistration',
                        '$$currentOngoingSemester',
                      ],
                    },
                    {
                      $eq: ['$student', '$$currentStudentId'],
                    },
                    {
                      $eq: ['$isEnrolled', true],
                    },
                  ],
                },
              },
            },
          ],
          as: 'enrolledCourse',
        },
      },
      {
        $addFields: {
          isAlreadyEnrolled: {
            $in: [
              '$course._id',
              {
                $map: {
                  input: '$enrolledcourses',
                  as: 'enroll',
                  in: '$$enroll.courses',
                },
              },
            ],
          },
        },
      },
    ]);

    return result;
  }
}
