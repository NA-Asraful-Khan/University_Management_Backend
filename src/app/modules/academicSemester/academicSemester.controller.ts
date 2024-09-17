/* eslint-disable @typescript-eslint/no-explicit-any */

import { handleResponse } from '../../utils/responseHandler';

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemester(
    req.body,
  );

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Academic Semester created successfully',
    data: result,
  });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAcademicSemester();

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semesters Get successfully',
    data: result,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await AcademicSemesterServices.getSingleAcademicSemester(semesterId);
  if (!result) {
    const error = new Error('Semester Not Found With This ID');
    (error as any).statusCode = 401;
    throw error;
  }

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Get successfully',
    data: result,
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await AcademicSemesterServices.updateAcademicSemester(
    semesterId,
    req.body,
  );

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is retrieved succesfully',
    data: result,
  });
});

export const AcademicSemesterController = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
