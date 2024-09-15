import { Request, Response } from 'express';
import { StundentServices } from './student.service';
import handleResponse from '../../../utils/responseHandler';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    const result = await StundentServices.createStudent(studentData);

    handleResponse(res, 200, true, 'Student created successfully', result);
  } catch (error) {
    handleResponse(res, 500, false, 'Error creating student', null);
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StundentServices.getAllStudents();
    handleResponse(res, 200, true, 'Students Get successfully', result);
  } catch (error) {
    handleResponse(res, 500, false, 'Error getting student', null);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StundentServices.getSingleStudent(studentId);
    handleResponse(res, 200, true, 'Student Get successfully', result);
  } catch (error) {
    handleResponse(res, 500, false, 'Error getting student', error);
  }
};

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
