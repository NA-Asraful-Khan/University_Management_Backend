/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { handleResponse } from '../../utils/responseHandler';
// import { z } from 'zod';
import { UserServices } from './user.service';
import httpStatus from 'http-status';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: studentData } = req.body;

    // Validation
    // const validateData = studentValidationSchema.parse(studentData);

    // Creating a new student

    if (!studentData) {
      const error = new Error('Student data are required');
      (error as any).statusCode = httpStatus.NOT_FOUND; // Custom status code
      throw error;
    }
    const result = await UserServices.createStudent(password, studentData);

    handleResponse.sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Student created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createStudent,
};
