import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { handleResponse } from '../../utils/responseHandler';
import { BaseController } from '../base/base.controller';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyService } from './academicFaculty.service';
import AppError from '../../errors/AppError';

export class AcademicFacultyController extends BaseController<TAcademicFaculty> {
  constructor() {
    super(new AcademicFacultyService());
  }

  findByFacultyId = catchAsync(async (req, res): Promise<void> => {
    const { facultyId } = req.params;
    const result = await (
      this.service as AcademicFacultyService
    ).findByFacultyId(facultyId);

    if (result) {
      handleResponse.sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Faculty retrieved successfully',
        data: result,
      });
    } else {
      throw new AppError(httpStatus.NOT_FOUND, 'Item not found');
    }
  });
}
