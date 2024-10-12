import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { handleResponse } from '../../utils/responseHandler';
import { FacultyServices } from './faculty.service';

const getAllFaculty = catchAsync(async (req, res) => {
  console.log('Test', req.user);
  const result = await FacultyServices.getAllFaculty();
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties Get successfully',
    data: result,
  });
});

const getFacultyByPaginationQuery = catchAsync(async (req, res) => {
  const result = await FacultyServices.getFacultyByPaginationQuery(req.query);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties Get successfully',
    data: result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getSingleFaculty(facultyId);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Get successfully',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFaculty(facultyId, faculty);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Update successfully',
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  await FacultyServices.deleteFaculty(facultyId);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty deleted successfully',
  });
});

export const FacultyControllers = {
  getAllFaculty,
  getSingleFaculty,
  getFacultyByPaginationQuery,
  updateFaculty,
  deleteFaculty,
};
