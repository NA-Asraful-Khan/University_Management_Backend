import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { PaginationResult } from '../../interface/pagination';
import { baseConstant } from '../base/base.constant';
import { BaseRepository } from '../base/base.repository';
import { TAcademicDepartment } from './academicDepertment.interface';
import { AcademicDepartmentModel } from './academicDepertment.model';

export class AcademicDepartmentRepository extends BaseRepository<TAcademicDepartment> {
  constructor() {
    super(AcademicDepartmentModel);
  }

  async findPaginationQuery(
    query: Record<string, unknown>,
  ): Promise<PaginationResult<TAcademicDepartment>> {
    const Query = new QueryBuilder(
      this.model.find().populate({
        path: 'academicFaculty',
        select: 'name', // Exclude _id from academicSemester
      }),
      query,
    )
      .search(baseConstant)
      .filter()
      .sort()
      .paginate()
      .fields();
    if (query._id && !mongoose.Types.ObjectId.isValid(query._id as string)) {
      throw new Error('Invalid Id');
    }
    const result = await Query.modelQuery;
    const pagination = await Query.countTotal();
    return { result, pagination };
  }
}
