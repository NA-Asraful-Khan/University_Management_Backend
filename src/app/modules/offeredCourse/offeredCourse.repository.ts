import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { BaseRepository } from '../base/base.repository';
import { StudentModel } from '../student/student.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourseModel } from './offeredCourse.model';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { PaginationResult } from '../../interface/pagination';
import QueryBuilder from '../../builder/QueryBuilder';
import { baseConstant } from '../base/base.constant';
import mongoose from 'mongoose';

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

  async findPaginationQuery(
    query: Record<string, unknown>,
  ): Promise<PaginationResult<TOfferedCourse>> {
    const Query = new QueryBuilder(
      this.model
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
        }),
      query,
    )
      .search(baseConstant)
      .filter()
      .sort()
      .paginate()
      .fields();
    if (query._id && !mongoose.Types.ObjectId.isValid(query._id as string)) {
      throw new Error('Invalid Id');
    }
    const result = await Query.modelQuery;
    const pagination = await Query.countTotal();
    return { result, pagination };
  }

  async findById(id: string): Promise<TOfferedCourse | null> {
    return this.model
      .findById(id)
      .populate({
        path: 'academicSemester',
        select: 'name year ', // Exclude _id from academicSemester
      })
      .populate({
        path: 'semesterRegistration',
        select: 'status ',
        populate: { path: 'academicSemester', select: 'name year ' }, // Exclude _id from semesterRegistration
      })
      .populate({
        path: 'academicFaculty',
        select: 'name ', // Exclude _id from academicFaculty
      })
      .populate({
        path: 'academicDepartment',
        select: 'name ', // Exclude _id from academicDepartment
      })
      .populate({
        path: 'course',
        select: 'title ', // Exclude _id from course
      })
      .populate({
        path: 'faculty',
        select: 'fullName name ', // Exclude _id from faculty
      })
      .select('-__v') // Exclude __v from the root document
      .exec();
  }

  async myOfferedCourse(
    userId: string,
    query: Record<string, unknown>,
  ): Promise<PaginationResult<TOfferedCourse>> {
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
    //Pagination Setup
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;
    const aggregationQuery = [
      {
        $match: {
          semesterRegistration: currentOngoingSemester?._id,
          // academicFaculty: student?.academicFaculty,
          academicDepartment: student?.academicDepartment,
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
        $lookup: {
          from: 'faculties',
          localField: 'faculty',
          foreignField: '_id',
          as: 'faculty',
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
            currentStudent: student._id,
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
                      $eq: ['$student', '$$currentStudent'],
                    },
                    {
                      $eq: ['$isEnrolled', true],
                    },
                  ],
                },
              },
            },
          ],
          as: 'enrolledcourses',
        },
      },
      {
        $lookup: {
          from: 'enrolledcourses',
          let: {
            currentStudent: student?._id,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$student', '$$currentStudent'],
                    },
                    {
                      $eq: ['$isCompleted', true],
                    },
                  ],
                },
              },
            },
          ],
          as: 'completedCourses',
        },
      },
      {
        $addFields: {
          completedCourseIds: {
            $map: {
              input: '$completedcourses',
              as: 'completed',
              in: '$$completed.course',
            },
          },
        },
      },
      {
        $addFields: {
          isPreRequisitesFulFilled: {
            $or: [
              { $eq: ['$course.preRequisiteCourses', []] },
              {
                $setIsSubset: [
                  '$course.preRequisiteCourses.course',
                  '$completedCourseIds',
                ],
              },
            ],
          },

          isAlreadyEnrolled: {
            $in: [
              '$course._id',
              {
                $map: {
                  input: '$enrolledcourses',
                  as: 'enroll',
                  in: '$$enroll.course',
                },
              },
            ],
          },
        },
      },
      {
        $match: {
          isAlreadyEnrolled: false,
          isPreRequisitesFulFilled: true,
        },
      },
    ];

    const paginationQuery = [
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const result = await OfferedCourseModel.aggregate([
      ...aggregationQuery,
      ...paginationQuery,
    ]);

    //Pagination Setup
    const total = (await OfferedCourseModel.aggregate(aggregationQuery)).length;
    const totalPage = Math.ceil(result.length / limit);
    const pagination = { page, limit, total, totalPage };

    return { result, pagination };
  }
}
