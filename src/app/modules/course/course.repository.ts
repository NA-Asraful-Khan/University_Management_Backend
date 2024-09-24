import mongoose from 'mongoose';
import { BaseRepository } from '../base/base.repository';
import { TCourse } from './course.interface';
import { CourseModel } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

export class CourseRepository extends BaseRepository<TCourse> {
  constructor() {
    super(CourseModel);
  }
  async findAll(): Promise<TCourse[]> {
    const rerult = await this.model.find().populate({
      path: 'preRequisiteCourses.course',
      populate: { path: 'preRequisiteCourses.course' },
    });
    return rerult as unknown as Promise<TCourse[]>;
  }
  async update(id: string, payload: Partial<TCourse>): Promise<TCourse> {
    const { preRequisiteCourses, ...courseRemainingData } = payload;
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Step One:
      const updateBasicCourse = await this.model.findByIdAndUpdate(
        id,
        courseRemainingData,
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!updateBasicCourse) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update basic course',
        );
      }
      // Step Two:
      if (preRequisiteCourses && preRequisiteCourses.length > 0) {
        const deletedPreRequisite = preRequisiteCourses
          .filter((el) => el.course && el.isDeleted)
          .map((el) => el.course);

        const deletedPreRequisiteCourse = await this.model.findByIdAndUpdate(
          id,
          {
            $pull: {
              preRequisiteCourses: { course: { $in: deletedPreRequisite } },
            },
          },
          { session },
        );

        if (!deletedPreRequisiteCourse) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Failed to delete pre requisite courses',
          );
        }

        // Step Three:
        const newPreRequisite = preRequisiteCourses?.filter(
          (el) => el.course && !el.isDeleted,
        );
        const addNewPrerequisitCourse = await this.model.findByIdAndUpdate(
          id,
          {
            $addToSet: { preRequisiteCourses: { $each: newPreRequisite } },
          },
          { new: true, runValidators: true, session },
        );

        if (!addNewPrerequisitCourse) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Failed to Add pre requisite courses',
          );
        }
      }

      await session.commitTransaction();
      await session.endSession();

      const result = await this.model.findById(id).populate({
        path: 'preRequisiteCourses.course',
        populate: { path: 'preRequisiteCourses.course' },
      });
      return result as TCourse;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(httpStatus.BAD_REQUEST, 'Course Update Faild');
    }
  }
}
