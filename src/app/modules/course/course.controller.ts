import { BaseController } from '../base/base.controller';
import { TCourse } from './course.interface';
import { CourseService } from './course.service';

export class CourseController extends BaseController<TCourse> {
  constructor() {
    super(new CourseService());
  }
}
