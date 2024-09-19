/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { handleResponse } from '../../utils/responseHandler';
import { AcademicDepertmentServices } from './academicDepertment.service';
import AppError from '../../errors/AppError';

const createAcademicDepertment = catchAsync(async (req, res) => {
  const result = await AcademicDepertmentServices.createAcademicDepertment(
    req.body,
  );
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Academic Depertment created successfully',
    data: result,
  });
});

const getAllAcademicDepertment = catchAsync(async (req, res) => {
  const result = await AcademicDepertmentServices.getAllAcademicDepertment();
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Depertment Get successfully',
    data: result,
  });
});

const getSingleAcademicDepertment = catchAsync(async (req, res) => {
  const { depertmentId } = req.params;
  const result =
    await AcademicDepertmentServices.getSingleAcademicDepertment(depertmentId);
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Depertment Not Found With This ID',
    );
  }
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Depertment Get successfully',
    data: result,
  });
});

const updateAcademicDepertment = catchAsync(async (req, res) => {
  const { depertmentId } = req.params;
  const result = await AcademicDepertmentServices.updateAcademicDepertment(
    depertmentId,
    req.body,
  );
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Depertment Not Found With This ID',
    );
  }
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Depertment updated successfully',
    data: result,
  });
});

export const AcademicDepertmentController = {
  createAcademicDepertment,
  getAllAcademicDepertment,
  getSingleAcademicDepertment,
  updateAcademicDepertment,
};
