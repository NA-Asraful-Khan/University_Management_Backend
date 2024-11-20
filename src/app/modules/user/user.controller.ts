/* eslint-disable @typescript-eslint/no-explicit-any */

import { handleResponse } from '../../utils/responseHandler';
// import { z } from 'zod';
import { UserServices } from './user.service';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  // Creating a new student

  if (!studentData) {
    throw new AppError(403, 'Student data are required');
  }
  const result = await UserServices.createStudent(
    req.file,
    password,
    studentData,
  );

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

const createFaculty: any = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  // Creating a new Faculty

  if (!facultyData) {
    throw new AppError(403, 'Faculty data are required');
  }
  const result = await UserServices.createFaculty(
    req.file,
    password,
    facultyData,
  );

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Faculty created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  // Creating admin
  if (!adminData) {
    throw new AppError(403, 'Admin data are required');
  }
  const result = await UserServices.createAdmin(req.file, password, adminData);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await UserServices.getMe(req.user);

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Me Successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.changeStatus(id);

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status Updated Successfully',
    data: result,
  });
});

export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
