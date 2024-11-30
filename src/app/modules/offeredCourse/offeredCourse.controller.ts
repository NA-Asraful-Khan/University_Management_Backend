import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { handleResponse } from '../../utils/responseHandler';
import { BaseController } from '../base/base.controller';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourseService } from './offeredCourse.service';

export class OfferedCourseController extends BaseController<TOfferedCourse> {
  constructor() {
    super(new OfferedCourseService());
  }

  myOfferedCourse = catchAsync(async (req, res): Promise<void> => {
    const userId = req.user.userId;

    const items = await (this.service as OfferedCourseService).myOfferedCourse(
      userId,
      req.query,
    );

    handleResponse.sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculties assigned to course successfully',
      data: items.result,
      pagination: items.pagination,
    });
  });
}
