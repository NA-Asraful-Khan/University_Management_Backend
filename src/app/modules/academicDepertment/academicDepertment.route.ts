import { BaseRoute } from '../base/base.route';
import { USER_ROLE } from '../user/user.constant';
import { AcademicDepartmentController } from './academicDepertment.controller';
import { TAcademicDepartment } from './academicDepertment.interface';
import { AcademicDepartmentValidation } from './academicDepertment.validation';

class AcademicDepartmentRoute extends BaseRoute<TAcademicDepartment> {
  constructor() {
    super(
      new AcademicDepartmentController(),
      {
        create: AcademicDepartmentValidation.academicDepartmentValidationSchema,
        update:
          AcademicDepartmentValidation.UpdateAcademicDepartmentValidationSchema,
      },
      [USER_ROLE.admin],
      [USER_ROLE.admin],
    );
  }
}

export const AcademicDepartmentRoutes = new AcademicDepartmentRoute().router;
