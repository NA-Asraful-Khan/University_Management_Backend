import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import httpStatus from 'http-status';
import { StudentInterface } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableField } from './student.constant';

const getAllStudents = async () => {
  const result = await StudentModel.find()
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepertment',
      populate: { path: 'academicFaculty' },
    });

  return result;
};

const getStudentPaginationQuery = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(StudentModel.find(), query)
    .search(studentSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;

  return result;
};

const getSingleStudent = async (id: string) => {
  const checkStudentAndUserExist = await StudentModel.isUserExist(id);
  if (!checkStudentAndUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Student with this Id Not Exist',
    );
  }
  const result = await StudentModel.findOne({ id: id })
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepertment',
      populate: { path: 'academicFaculty' },
    });

  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<StudentInterface>,
) => {
  const checkStudentAndUserExist = await StudentModel.isUserExist(id);
  if (!checkStudentAndUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Student with this Id Not Exist',
    );
  }
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
  const checkStudentAndUserExist = await StudentModel.isUserExist(id);
  if (!checkStudentAndUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Student with this Id Not Exist',
    );
  }
  const session = await mongoose.startSession();

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
  getStudentPaginationQuery,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
