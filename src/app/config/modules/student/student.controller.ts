import { Request, Response } from 'express';
import { StundentServices } from './student.service';
import { handleResponse } from '../../../utils/responseHandler';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    const result = await StundentServices.createStudent(studentData);

    handleResponse.handleResponseSuccess(
      res,
      200,
      true,
      'Student created successfully',
      result,
    );
  } catch (error) {
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
    if (result) {
      handleResponse.handleResponseSuccess(
        res,
        200,
        true,
        'Student Get successfully',
        result,
      );
    } else {
      handleResponse.handleError(
        res,
        'Student Not Found with this ID',
        'Student not found',
        404,
      );
    }
  } catch (error) {
    handleResponse.handleError(res, error, 'Error getting student', 500);
  }
};

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
