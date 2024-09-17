/* eslint-disable @typescript-eslint/no-explicit-any */

import { StundentServices } from './student.service';
import { handleResponse } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StundentServices.getAllStudents();
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Studdents Get successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StundentServices.getSingleStudent(studentId);
  if (!result) {
    const error = new Error('Student Not Found With This ID');
    (error as any).statusCode = 401;
    throw error;
  }

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Get successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StundentServices.deleteStudent(studentId);

  if (result.modifiedCount === 0) {
    const error = new Error('Student Not Found With This ID');
    (error as any).statusCode = 401;
    throw error;
  }
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Delete successfully',
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
