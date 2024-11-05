import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { facultySearchableField } from './faculty.constant';
import { FacultyModel } from './faculty.model';
import { TFaculty } from './faculty.interface';
import mongoose from 'mongoose';
import { UserModel } from '../user/user.model';

const getAllFaculty = async () => {
  const result = await FacultyModel.find().populate({
    path: 'user',
    select: '-_id id role status', // Exclude _id from academicSemester
  });

  return result;
};

const getFacultyByPaginationQuery = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    FacultyModel.find().populate({
      path: 'user',
      select: '-_id id role status', // Exclude _id from academicSemester
    }),
    query,
  )
    .search(facultySearchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  const pagination = await facultyQuery.countTotal();
  return {
    result,
    pagination,
  };
};

const getSingleFaculty = async (id: string) => {
  const checkFacultyAndUserExist = await FacultyModel.isUserExists(id);
  if (!checkFacultyAndUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Faculty with this Id Not Exist',
    );
  }
  const result = await FacultyModel.findOne({ id: id }).populate('user');

  return result;
};

const updateFaculty = async (id: string, payload: Partial<TFaculty>) => {
  const checkFacultyAndUserExist = await FacultyModel.isUserExists(id);
  if (!checkFacultyAndUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Faculty with this Id Not Exist',
    );
  }

  const { name, ...remainingFacultyData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await FacultyModel.findOneAndUpdate(
    { id: id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

const deleteFaculty = async (id: string) => {
  const checkFacultyAndUserExist = await FacultyModel.isUserExists(id);
  if (!checkFacultyAndUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Faculty with this Id Not Exist',
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedFaculty = await FacultyModel.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Delete faculty');
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Delete User');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(500, 'Error Deleting faculty');
  }
};

export const FacultyServices = {
  getAllFaculty,
  getSingleFaculty,
  getFacultyByPaginationQuery,
  updateFaculty,
  deleteFaculty,
};
