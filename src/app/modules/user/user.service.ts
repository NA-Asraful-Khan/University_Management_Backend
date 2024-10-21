/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { TAdmin } from '../admin/admin.interface';
import { AcademicDepartmentModel } from '../academicDepertment/academicDepertment.model';

import { JwtPayload } from 'jsonwebtoken';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudent = async (
  file: any,
  password: string,
  studentData: StudentInterface,
) => {
  //Create a User Object
  const userData: Partial<UserInterface> = {};
  //Use Default Password
  userData.password = password || (config.default_password as string);

  // set Student role
  userData.role = 'student';
  userData.email = studentData?.email;
  //Check if the email is already Used
  const checkStudentEmail = await StudentModel.findOne({
    email: studentData.email,
  });
  if (checkStudentEmail) {
    throw new AppError(httpStatus.CONFLICT, 'Email already exists');
  }
  //Auto Generate Id
  // Check if admissionSemester and academicDepartment exists or not
  const admissionSemester = await AcademicSemesterModel.findById(
    studentData.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admission Semester Not Found');
  }
  const academicDepartment = await AcademicDepartmentModel.findById(
    studentData.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department Not Found');
  }

  studentData.academicFaculty = academicDepartment.academicFaculty;

  // Session Start
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateStudentId(admissionSemester!);
    //Sent Image To Cloudinary
    if (file) {
      const imageName = `${userData?.id}${studentData?.name?.firstName}`;
      const path = file?.path;
      const { url } = await sendImageToCloudinary(imageName, path);

      studentData.profileImg = url as string;
    }
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

const createFaculty = async (
  file: any,
  password: string,
  facultyData: TFaculty,
) => {
  //Create a User Object
  const userData: Partial<UserInterface> = {};
  //Use Default Password
  userData.password = password || (config.default_password as string);

  // set Faculty role
  userData.role = 'faculty';
  userData.email = facultyData?.email;

  //Auto Generate Id
  const checkFacultyEmail = await FacultyModel.findOne({
    email: facultyData.email,
  });
  if (checkFacultyEmail) {
    throw new AppError(httpStatus.CONFLICT, 'Email already exists');
  }
  const academicDepartment = await AcademicDepartmentModel.findById(
    facultyData.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department Not Found');
  }
  // Session Start
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateFacultyId();
    //Sent Image To Cloudinary
    if (file) {
      const imageName = `${userData?.id}${facultyData?.name?.firstName}`;
      const path = file?.path;
      const { url } = await sendImageToCloudinary(imageName, path);
      facultyData.profileImg = url as string;
    }
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

const createAdmin = async (file: any, password: string, adminData: TAdmin) => {
  //Create a User Object
  const userData: Partial<UserInterface> = {};
  //Use Default Password
  userData.password = password || (config.default_password as string);

  // set Faculty role
  userData.role = 'admin';
  userData.email = adminData?.email;
  //Auto Generate Id
  userData.email = adminData?.email;
  //Check if the email is already Used
  const checkStudentEmail = await AdminModel.findOne({
    email: adminData.email,
  });
  if (checkStudentEmail) {
    throw new AppError(httpStatus.CONFLICT, 'Email already exists');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateAdminId();

    //Sent Image To Cloudinary
    if (file) {
      const imageName = `${userData?.id}${adminData?.name?.firstName}`;
      const path = file?.path;
      const { url } = await sendImageToCloudinary(imageName, path);
      adminData.profileImg = url as string;
    }
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

const getMe = async (payLoad: JwtPayload) => {
  const { userId, role } = payLoad;
  let result = null;
  if (role === 'student') {
    result = await StudentModel.findOne({ id: userId });
  }
  if (role === 'faculty') {
    result = await FacultyModel.findOne({ id: userId });
  }
  if (role === 'admin') {
    result = await AdminModel.findOne({ id: userId });
  }
  return result;
};

const changeStatus = async (id: string) => {
  const userData = await UserModel.findOne({ id: id });

  let updateStatus: { status: string } | undefined;

  if (userData?.status === 'in-progress') {
    updateStatus = { status: 'blocked' };
  } else if (userData?.status === 'blocked') {
    updateStatus = { status: 'in-progress' };
  }

  if (updateStatus) {
    const result = await UserModel.findOneAndUpdate({ id }, updateStatus, {
      new: true,
    });
    return result;
  }

  // If no status update is required, you can return the original user or handle it as needed
  return userData;
};

export const UserServices = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
