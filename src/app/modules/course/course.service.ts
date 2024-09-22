import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCourse } from './course.interface';
import { CourseModel } from './course.model';
import { CourseSearchableFields } from './course.constant';
import QueryBuilder from '../../builder/QueryBuilder';

const createCourse = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

const getAllCourses = async () => {
  const result = await CourseModel.find();
  return result;
};

const getCoursesbyPaginationQuery = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(CourseModel.find(), query)
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourse = async (id: string) => {
  const result = await CourseModel.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found with this id');
  }
  return result;
};

const deleteCourse = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found with this id');
  }
  return result;
};
export const CourseServices = {
  createCourse,
  getAllCourses,
  getCoursesbyPaginationQuery,
  getSingleCourse,
  deleteCourse,
};
