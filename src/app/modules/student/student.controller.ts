/* eslint-disable @typescript-eslint/no-explicit-any */

import { StundentServices } from './student.service';
import { handleResponse } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StundentServices.getAllStudents();
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students Get successfully',
    data: result,
  });
});

const getStudentPaginationQuery = catchAsync(async (req, res) => {
  const result = await StundentServices.getStudentPaginationQuery(req.query);
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
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not Found With This ID');
  }

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Get successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const { student } = req.body;
  const result = await StundentServices.updateStudent(studentId, student);

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Update successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  await StundentServices.deleteStudent(studentId);

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Delete successfully',
  });
});

export const StudentController = {
  getAllStudents,
  getStudentPaginationQuery,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
