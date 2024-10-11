/* eslint-disable no-unused-vars */
import mongoose, { Types } from 'mongoose';
import { BaseRepository } from '../base/base.repository';
import { TCourse, TCourseFaculty } from './course.interface';
import { CourseFacultyModel, CourseModel } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { FacultyModel } from '../faculty/faculty.model';

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

// Implement the extended repository
export class FacultiesWithCourseRepository extends BaseRepository<TCourseFaculty> {
  constructor() {
    super(CourseFacultyModel);
  }
  async findAll(): Promise<TCourseFaculty[]> {
    return this.model
      .find()
      .populate({
        path: 'faculties',
        select: '-_id name', // Include both _id and fullName from faculties
      })
      .populate('course', 'title') // Example: populate course with title
      .exec();
  }

  async assignFacultiesWithCourse(
    courseId: string,
    payload: { faculties: string[] },
  ): Promise<TCourseFaculty | null> {
    // Convert string IDs to ObjectIds
    const facultyObjectIds = payload.faculties.map(
      (id) => new Types.ObjectId(id),
    );
    const checkCourse = await CourseModel.findById(courseId);

    if (!checkCourse) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Course With This Id Not Found',
      );
    }

    // Check if all faculties exist
    const existingFaculties = await FacultyModel.find({
      _id: { $in: facultyObjectIds },
    });

    if (existingFaculties.length !== facultyObjectIds.length) {
      const invalidFaculties = facultyObjectIds.filter(
        (id) => !existingFaculties.some((faculty) => faculty._id.equals(id)),
      );
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `The following faculty IDs do not exist: ${invalidFaculties.join(
          ', ',
        )}`,
      );
    }
    // Update the course with faculties
    const result = await this.model.findOneAndUpdate(
      { course: new Types.ObjectId(courseId) },
      {
        $addToSet: { faculties: { $each: facultyObjectIds } },
      },
      { new: true, upsert: true },
    );

    return result;
  }

  async removeFacultiesWithCourse(
    courseId: string,
    payload: { faculties: string[] },
  ): Promise<TCourseFaculty | null> {
    // Convert string IDs to ObjectIds
    const facultyObjectIds = payload.faculties.map(
      (id) => new Types.ObjectId(id),
    );

    // Check if course exists
    const checkCourse = await CourseModel.findById(courseId);
    if (!checkCourse) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Course With This Id Not Found',
      );
    }

    // Check if all faculties exist
    const existingFaculties = await FacultyModel.find({
      _id: { $in: facultyObjectIds },
    });

    if (existingFaculties.length !== facultyObjectIds.length) {
      const invalidFaculties = facultyObjectIds.filter(
        (id) => !existingFaculties.some((faculty) => faculty._id.equals(id)),
      );
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `The following faculty IDs do not exist: ${invalidFaculties.join(
          ', ',
        )}`,
      );
    }

    // Remove the faculties from the course
    await this.model.findOneAndUpdate(
      { course: new Types.ObjectId(courseId) },
      {
        $pull: { faculties: { $in: facultyObjectIds } },
      },
    );

    const result = await this.model.findOne({
      course: new Types.ObjectId(courseId),
    });

    return result;
  }
}
