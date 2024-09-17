/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { StundentServices } from './student.service';

import { handleResponse } from '../../utils/responseHandler';
import httpStatus from 'http-status';

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StundentServices.getAllStudents();

    handleResponse.sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Studdents Get successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
