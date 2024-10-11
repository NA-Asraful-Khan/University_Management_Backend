import { BaseController } from '../base/base.controller';
import { TAcademicDepartment } from './academicDepertment.interface';
import { AcademicDepartmentService } from './academicDepertment.service';

export class AcademicDepartmentController extends BaseController<TAcademicDepartment> {
  constructor() {
    super(new AcademicDepartmentService());
  }
}
