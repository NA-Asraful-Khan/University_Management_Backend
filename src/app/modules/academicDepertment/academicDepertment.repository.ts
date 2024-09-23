import { BaseRepository } from '../base/base.repository';
import { TAcademicDepertment } from './academicDepertment.interface';
import { AcademicDepertmentModel } from './academicDepertment.model';

export class AcademicDepertmentRepository extends BaseRepository<TAcademicDepertment> {
  constructor() {
    super(AcademicDepertmentModel);
  }
}
