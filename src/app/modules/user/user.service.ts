import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { StudentInterface } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { UserInterface } from './user.interface';

import { UserModel } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import { FacultyModel } from '../faculty/faculty.model';
import { AdminModel } from '../admin/admin.model';

const createStudent = async (
  password: string,
  studentData: StudentInterface,
) => {
  //Create a User Object
  const userData: Partial<UserInterface> = {};
  //Use Default Password
  userData.password = password || (config.default_password as string);

  // set Student role
  userData.role = 'student';

  //Auto Generate Id

  const admissionSemester = await AcademicSemesterModel.findById(
    studentData.admissionSemester,
  );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateStudentId(admissionSemester!);
    //Create a User [Transaction One]
    const newUser = await UserModel.create([userData], { session });

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }
    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id;
    //Create a Student [Transaction Two]
    const newStudent = await StudentModel.create([studentData], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(500, 'Error creating student');
  }
};

const createFaculty = async (password: string, facultyData: TFaculty) => {
  //Create a User Object
  const userData: Partial<UserInterface> = {};
  //Use Default Password
  userData.password = password || (config.default_password as string);

  // set Faculty role
  userData.role = 'faculty';

  //Auto Generate Id

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateFacultyId();
    //Create a User [Transaction One]
    const newUser = await UserModel.create([userData], { session });

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }
    facultyData.id = newUser[0].id;
    facultyData.user = newUser[0]._id;
    //Create a Student [Transaction Two]
    const newFaculty = await FacultyModel.create([facultyData], { session });
    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(500, 'Error creating Faculty');
  }
};

const createAdmin = async (password: string, adminData: TFaculty) => {
  //Create a User Object
  const userData: Partial<UserInterface> = {};
  //Use Default Password
  userData.password = password || (config.default_password as string);

  // set Faculty role
  userData.role = 'admin';

  //Auto Generate Id

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateAdminId();
    //Create a User [Transaction One]
    const newUser = await UserModel.create([userData], { session });

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }
    adminData.id = newUser[0].id;
    adminData.user = newUser[0]._id;
    //Create a Student [Transaction Two]
    const newAdmin = await AdminModel.create([adminData], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(500, 'Error creating Admin');
  }
};

export const UserServices = {
  createStudent,
  createFaculty,
  createAdmin,
};
