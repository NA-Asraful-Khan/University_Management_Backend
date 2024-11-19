// academicFaculty.route.ts

import { TAcademicFaculty } from './academicFaculty.interface';
import { BaseRoute } from '../base/base.route';
import { AcademicFacultyController } from './academicFaculty.controller';
import { setMethodNotAllowed } from '../../routes/excludeRoute/excludeRoute';
import { USER_ROLE } from '../user/user.constant';
import { AcademicFacultyValidation } from './academicFaculty.validation';

class AcademicFacultyRoute extends BaseRoute<TAcademicFaculty> {
  constructor() {
    super(
      new AcademicFacultyController(),
      {
        create: AcademicFacultyValidation.academicFacultyValidationSchema,
        update: AcademicFacultyValidation.academicFacultyValidationSchema,
      },
      [USER_ROLE.superAdmin, USER_ROLE.admin],
      [USER_ROLE.superAdmin, USER_ROLE.admin],
      [USER_ROLE.superAdmin, USER_ROLE.admin],
    );
  }

  protected initializeRoutes(): void {
    const Controller = this.controller as AcademicFacultyController;
    // overwrite Route || Create New Route
    this.router.get('/:facultyId', Controller.findByFacultyId);

    // Exclude Route

    setMethodNotAllowed(
      this.router,
      'patch',
      '/:id',
      'Patch action is not allowed for this resource.',
    );
    super.initializeRoutes();
  }
}

export const academicFacultyRoutes = new AcademicFacultyRoute().router;
