import { BaseService } from '../base/base.service';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourseRepository } from './offeredCourse.repository';
export class OfferedCourseService extends BaseService<TOfferedCourse> {
  constructor() {
    super(new OfferedCourseRepository());
  }
}
