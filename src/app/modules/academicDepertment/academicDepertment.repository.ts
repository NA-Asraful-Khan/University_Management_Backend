import { BaseRepository } from '../base/base.repository';
import { TAcademicDepartment } from './academicDepertment.interface';
import { AcademicDepartmentModel } from './academicDepertment.model';

export class AcademicDepartmentRepository extends BaseRepository<TAcademicDepartment> {
  constructor() {
    super(AcademicDepartmentModel);
  }
}
