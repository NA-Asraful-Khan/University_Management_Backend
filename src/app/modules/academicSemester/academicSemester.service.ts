import { BaseService } from '../base/base.service';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterRepository } from './academicSemester.repository';

export class AcademicSemesterService extends BaseService<TAcademicSemester> {
  constructor() {
    super(new AcademicSemesterRepository());
  }
}
