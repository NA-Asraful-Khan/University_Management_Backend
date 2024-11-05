import { PaginationResult } from '../../interface/pagination';
import { BaseService } from '../base/base.service';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourseRepository } from './offeredCourse.repository';
export class OfferedCourseService extends BaseService<TOfferedCourse> {
  constructor() {
    super(new OfferedCourseRepository());
  }

  async myOfferedCourse(
    userId: string,
    query: Record<string, unknown>,
  ): Promise<PaginationResult<TOfferedCourse>> {
    return (this.repository as OfferedCourseRepository).myOfferedCourse(
      userId,
      query,
    );
  }
}
