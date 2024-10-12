import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { baseConstant } from '../base/base.constant';
import { BaseRepository } from '../base/base.repository';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';
import { RegistrationStatus } from './semesterRegistration.constant';
import mongoose from 'mongoose';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';

export class SemesterRegistrationRepository extends BaseRepository<TSemesterRegistration> {
  constructor() {
    super(SemesterRegistrationModel);
  }

  async findAll(): Promise<TSemesterRegistration[]> {
    return this.model.find().populate('academicSemester');
  }
  async findPaginationQuery(
    query: Record<string, unknown>,
  ): Promise<TSemesterRegistration[]> {
    const Query = new QueryBuilder(
      this.model.find().populate('academicSemester'),
      query,
    )
      .search(baseConstant)
      .filter()
      .sort()
      .paginate()
      .fields();

    return await Query.modelQuery;
  }

  async update(
    id: string,
    data: Partial<TSemesterRegistration>,
  ): Promise<TSemesterRegistration | null> {
    // Check if the Semester Regestrations Exist
    const isSemesterRegestrationExist =
      await SemesterRegistrationModel.findById(id);

    if (!isSemesterRegestrationExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'This Semester is not Found!');
    }

    // Check Requested Semester Status
    const currentSemesterStatus = isSemesterRegestrationExist?.status;
    const requestedSemesterStatus = data?.status;
    if (currentSemesterStatus === RegistrationStatus.ENDED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `This semester is already ${currentSemesterStatus}`,
      );
    }

    if (
      currentSemesterStatus === RegistrationStatus.UPCOMING &&
      requestedSemesterStatus === RegistrationStatus.ENDED
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Cannot update status from UPCOMING to ENDED',
      );
    }

    if (
      currentSemesterStatus === RegistrationStatus.ONGOING &&
      requestedSemesterStatus === RegistrationStatus.UPCOMING
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Cannot update status from ONGOING to UPCOMING',
      );
    }

    return this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<TSemesterRegistration | null> {
    const currentSemester = await this.model.findById(id);
    if (!currentSemester) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Semester with this id Not Found`,
      );
    }
    if (currentSemester?.status !== 'UPCOMING') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Can not delete Semester because it is already ${currentSemester?.status}`,
      );
    }
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      // First Transaction
      await OfferedCourseModel.deleteMany({
        semesterRegistration: { $eq: id },
      });
      //Second Transaction
      // Second Transaction: Use `lean()` to return a plain JavaScript object
      const deleteRegistrationSemester = await this.model
        .findByIdAndDelete(id)
        .lean<TSemesterRegistration>();
      await session.commitTransaction();
      await session.endSession();
      return deleteRegistrationSemester;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(500, 'Error Deleting faculty');
    }
  }
}
