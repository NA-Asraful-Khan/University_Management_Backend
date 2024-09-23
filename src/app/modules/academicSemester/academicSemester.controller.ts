import { BaseController } from '../base/base.controller';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterService } from './academicSemester.service';

export class AcademicSemesterController extends BaseController<TAcademicSemester> {
  constructor() {
    super(new AcademicSemesterService());
  }
}
