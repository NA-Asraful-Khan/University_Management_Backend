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
  const result = await UserServices.createStudent(password, studentData);

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

export const UserController = {
  createStudent,
};
