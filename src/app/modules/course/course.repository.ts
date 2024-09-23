import { BaseRepository } from '../base/base.repository';
import { TCourse } from './course.interface';
import { CourseModel } from './course.model';

export class CourseRepository extends BaseRepository<TCourse> {
  constructor() {
    super(CourseModel);
  }
}
