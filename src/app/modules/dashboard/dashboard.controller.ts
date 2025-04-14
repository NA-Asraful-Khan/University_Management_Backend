import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { handleResponse } from '../../utils/responseHandler';
import { DashboardServices } from './dashboard.service';

const getAdminDashboard = catchAsync(async (req, res) => {
  const result = await DashboardServices.getAdminDashboard();
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Data Get successfully',
    data: result,
  });
});

const getFacultyDashboard = catchAsync(async (req, res) => {
   const facultyId = req.user.userId;
  const result = await DashboardServices.getFacultyDashboard(facultyId);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Data Get successfully',
    data: result,
  });
});

const getStudentDashboard = catchAsync(async (req, res) => {
   const studentId = req.user.userId;
  const result = await DashboardServices.getStudentDashboard(studentId);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Data Get successfully',
    data: result,
  });
});


export const DashboardControllers = {
  getAdminDashboard,
  getFacultyDashboard,
  getStudentDashboard,
};
