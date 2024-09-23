import { BaseService } from '../base/base.service';
import { TAcademicDepertment } from './academicDepertment.interface';
import { AcademicDepertmentRepository } from './academicDepertment.repository';

export class AcademicDepertmentService extends BaseService<TAcademicDepertment> {
  constructor() {
    super(new AcademicDepertmentRepository());
  }
}
