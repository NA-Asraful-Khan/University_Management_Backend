import { BaseService } from '../base/base.service';
import { TCourse } from './course.interface';
import { CourseRepository } from './course.repository';

export class CourseService extends BaseService<TCourse> {
  constructor() {
    super(new CourseRepository());
  }
}
