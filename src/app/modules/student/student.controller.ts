import { Request, Response } from 'express';
import { StundentServices } from './student.service';
import studentValidationSchema from './student.validation';
import { z } from 'zod';
import { handleResponse } from '../../utils/responseHandler';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    // Validation
    const validateData = studentValidationSchema.parse(studentData);

    // Creating a new student
    const result = await StundentServices.createStudent(validateData);

    handleResponse.handleResponseSuccess(
      res,
      200,
      true,
      'Student created successfully',
      result,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map((err) => ({
        errors: [
          {
            message: `${err.path.join('.')} is ${err.message}`,
          },
        ],
      }));
      return handleResponse.handleError(
        res,
        validationErrors[0],
        'Failed to create student',
        400,
      );
    }

    // Handle other errors
    handleResponse.handleError(res, error, 'Failed to create student', 500);
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StundentServices.getAllStudents();
    handleResponse.handleResponseSuccess(
      res,
      200,
      true,
      'Students Get successfully',
      result,
    );
  } catch (error) {
    handleResponse.handleError(res, error, 'Error getting students', 500);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StundentServices.getSingleStudent(studentId);
    handleResponse.handleResponseSuccess(
      res,
      200,
      true,
      'Student Get successfully',
      result,
    );
  } catch (error) {
    handleResponse.handleError(res, error, 'Error getting student', 500);
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StundentServices.deleteStudent(studentId);
    handleResponse.handleResponseSuccess(
      res,
      200,
      true,
      'Student Delete successfully',
      result,
    );
  } catch (error) {
    handleResponse.handleError(res, error, 'Error Deleting student', 500);
  }
};

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
