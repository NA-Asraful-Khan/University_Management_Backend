import { BaseRoute } from '../base/base.route';
import { AcademicDepertmentController } from './academicDepertment.controller';
import { TAcademicDepertment } from './academicDepertment.interface';
import { AcademicDepertmentValidation } from './academicDepertment.validation';

class AcademicDepertmentRoute extends BaseRoute<TAcademicDepertment> {
  constructor() {
    super(new AcademicDepertmentController(), {
      create: AcademicDepertmentValidation.academicDepertmentValidationSchema,
      update:
        AcademicDepertmentValidation.UpdateAcademicDepertmentValidationSchema,
    });
  }
}

export const AcademicDepertmentRoutes = new AcademicDepertmentRoute().router;
