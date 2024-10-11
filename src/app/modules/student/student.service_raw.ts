import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import httpStatus from 'http-status';
import { StudentInterface } from './student.interface';

const getAllStudents = async (query: Record<string, unknown>) => {
  let searchField = '';
  const studentSearchableField = [
    'id',
    'email',
    'name.firstName',
    'presentAddress',
  ];
  const queryObj = { ...query };

  if (query?.searchField) {
    searchField = query.searchField as string;
  }

  // Search Query
  const searchQuery = StudentModel.find({
    $or: studentSearchableField.map((field) => ({
      [field]: { $regex: searchField, $options: 'i' },
    })),
  });

  //filtering query
  const excludeFields = ['searchField', 'sort', 'limit', 'page', 'fields'];
  excludeFields.forEach((el) => {
    delete queryObj[el];
  });

  const filterQuery = searchQuery
    .find(queryObj)
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });

  // Sort Query
  let sort = '_id';

  if (query.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  // Pagination Query and Limit Query
  let page = 1;
  let limit = 3; // This looks unusually small, probably you want a larger default like 10
  let skip = 0;

  if (query.limit) {
    limit = query.limit as number;
  }

  if (query.page) {
    page = query.page as number;
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip).limit(limit);

  const limitQuery = paginateQuery.limit(limit);

  //Fields Query

  let fields = '-__v';

  if (query.fields) {
    fields = (query.fields as string).split(',').join(' ');
  }

  const fieldQuery = await limitQuery.select(fields);
  return fieldQuery;
};

const getSingleStudent = async (id: string) => {
  const result = await StudentModel.findOne({ id: id })
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });

  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<StudentInterface>,
) => {
  const { name, gurdian, localGuardians, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (gurdian && Object.keys(gurdian).length) {
    for (const [key, value] of Object.entries(gurdian)) {
      modifiedUpdatedData[`gurdian.${key}`] = value;
    }
  }

  if (localGuardians && Object.keys(localGuardians).length) {
    for (const [key, value] of Object.entries(localGuardians)) {
      modifiedUpdatedData[`localGuardians.${key}`] = value;
    }
  }

  const result = await StudentModel.findOneAndUpdate(
    { id: id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

const deleteStudent = async (id: string) => {
  const session = await mongoose.startSession();
  const checkStudentAndUserExist = await StudentModel.isUserExist(id);
  if (!checkStudentAndUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Student with this Id Not Exist',
    );
  }
  try {
    session.startTransaction();
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Delete student');
    }

    const deleteUser = await UserModel.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Delete User');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(500, 'Error Deleting student');
  }
};
export const StundentServices = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
