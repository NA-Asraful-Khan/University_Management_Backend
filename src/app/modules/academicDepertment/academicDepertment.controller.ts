import { BaseController } from '../base/base.controller';
import { TAcademicDepertment } from './academicDepertment.interface';
import { AcademicDepertmentService } from './academicDepertment.service';

export class AcademicDepertmentController extends BaseController<TAcademicDepertment> {
  constructor() {
    super(new AcademicDepertmentService());
  }
}
