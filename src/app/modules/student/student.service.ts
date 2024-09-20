import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import httpStatus from 'http-status';
import { StudentInterface } from './student.interface';

const getAllStudents = async (query: Record<string, unknown>) => {
  let searchField = '';

  if (query?.searchField) {
    searchField = query.searchField as string;
  }

  const result = await StudentModel.find({
    $or: ['email', 'name.firstName', 'presentAddress'].map((field) => ({
      [field]: { $regex: searchField, $options: 'i' },
    })),
  })
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepertment',
      populate: { path: 'academicFaculty' },
    });
  return result;
};

const getSingleStudent = async (id: string) => {
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
