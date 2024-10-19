import { BaseRepository } from '../base/base.repository';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourseModel } from './offeredCourse.model';

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
}
