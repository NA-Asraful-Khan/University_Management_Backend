import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import httpStatus from 'http-status';

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
  deleteStudent,
};
