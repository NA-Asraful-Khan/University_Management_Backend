/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { handleResponse } from '../../utils/responseHandler';
// import { z } from 'zod';
import { UserServices } from './user.service';

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
      (error as any).statusCode = 400; // Custom status code
      throw error;
    }
    const result = await UserServices.createStudent(password, studentData);

    handleResponse.handleResponseSuccess(
      res,
      200,
      true,
      'Student created successfully',
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createStudent,
};
