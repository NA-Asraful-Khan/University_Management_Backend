import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { handleResponse } from '../../utils/responseHandler';
import { BaseController } from '../base/base.controller';
import { TCourse, TCourseFaculty } from './course.interface';
import { CourseService, FacultiesWithCouresService } from './course.service';
import AppError from '../../errors/AppError';

export class CourseController extends BaseController<TCourse> {
  constructor() {
    super(new CourseService());
  }
}

// Update the controller to use the extended service
export class FacultiesWithCouresController extends BaseController<TCourseFaculty> {
  constructor() {
    super(new FacultiesWithCouresService());
  }

  assignFacultiesWithCourse = catchAsync(async (req, res): Promise<void> => {
    const { courseId } = req.params;
    const { faculties } = req.body;

    if (!Array.isArray(faculties)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Faculties must be an array of strings',
      );
    }

    const item = await (
      this.service as FacultiesWithCouresService
    ).assignFacultiesWithCourse(courseId, { faculties });

    if (item) {
      handleResponse.sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties assigned to course successfully',
        data: item,
      });
    } else {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to assign faculties to course',
      );
    }
  });

  removeFacultiesWithCourse = catchAsync(async (req, res): Promise<void> => {
    const { courseId } = req.params;
    const { faculties } = req.body;

    if (!Array.isArray(faculties)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Faculties must be an array of strings',
      );
    }

    const item = await (
      this.service as FacultiesWithCouresService
    ).removeFacultiesWithCourse(courseId, { faculties });

    if (item) {
      handleResponse.sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties remove from course successfully',
        data: item,
      });
    } else {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to Remove faculties from course',
      );
    }
  });
}
