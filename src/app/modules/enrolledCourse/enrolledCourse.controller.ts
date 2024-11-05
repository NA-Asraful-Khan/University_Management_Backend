import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { handleResponse } from '../../utils/responseHandler';
import { EnrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await EnrolledCourseServices.createEnrolledCourse(
    userId,
    req.body,
  );

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled course created successfully',
    data: result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;
  const result = await EnrolledCourseServices.updateEnrolledCourseMarks(
    facultyId,
    req.body,
  );

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled course marks updated successfully',
    data: result,
  });
});

const getMyEnrolledCourses = catchAsync(async (req, res) => {
  // const studentId = req.user.userId;
  // const result = await EnrolledCourseServices.createEnrolledCourse(
  //   studentId,
  //   req.query
  // );

  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled course created successfully',
    data: null,
  });
});

export const EnrolledCourseControlles = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getMyEnrolledCourses,
};
