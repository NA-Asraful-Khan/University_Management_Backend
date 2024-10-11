import { BaseRoute } from '../base/base.route';
import { AcademicDepartmentController } from './academicDepertment.controller';
import { TAcademicDepartment } from './academicDepertment.interface';
import { AcademicDepartmentValidation } from './academicDepertment.validation';

class AcademicDepartmentRoute extends BaseRoute<TAcademicDepartment> {
  constructor() {
    super(new AcademicDepartmentController(), {
      create: AcademicDepartmentValidation.academicDepartmentValidationSchema,
      update:
        AcademicDepartmentValidation.UpdateAcademicDepartmentValidationSchema,
    });
  }
}

export const AcademicDepartmentRoutes = new AcademicDepartmentRoute().router;
