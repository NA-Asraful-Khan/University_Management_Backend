import { BaseService } from '../base/base.service';
import { TAcademicDepartment } from './academicDepertment.interface';
import { AcademicDepartmentRepository } from './academicDepertment.repository';

export class AcademicDepartmentService extends BaseService<TAcademicDepartment> {
  constructor() {
    super(new AcademicDepartmentRepository());
  }
}
