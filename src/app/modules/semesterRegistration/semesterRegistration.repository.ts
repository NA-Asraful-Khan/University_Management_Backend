import QueryBuilder from '../../builder/QueryBuilder';
import { baseConstant } from '../base/base.constant';
import { BaseRepository } from '../base/base.repository';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';

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
}
