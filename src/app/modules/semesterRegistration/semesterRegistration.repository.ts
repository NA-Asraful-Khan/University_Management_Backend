import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { baseConstant } from '../base/base.constant';
import { BaseRepository } from '../base/base.repository';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';
import { RegistrationStatus } from './semesterRegistration.constant';

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
}
