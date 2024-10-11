import { BaseController } from '../base/base.controller';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourseService } from './offeredCourse.service';

export class OfferedCourseController extends BaseController<TOfferedCourse> {
  constructor() {
    super(new OfferedCourseService());
  }
}
