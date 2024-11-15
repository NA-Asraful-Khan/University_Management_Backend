import { BaseRoute } from '../base/base.route';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterController } from './academicSemester.controller';
import { setMethodNotAllowed } from '../../routes/excludeRoute/excludeRoute';
import { AcademicSemesterValidation } from './academicSemester.validation';
import { USER_ROLE } from '../user/user.constant';

class AcademicSemesterRoute extends BaseRoute<TAcademicSemester> {
  constructor() {
    super(
      new AcademicSemesterController(),
      {
        create:
          AcademicSemesterValidation.createAcademicSemesterValidationSchema,
        update:
          AcademicSemesterValidation.createAcademicSemesterValidationSchema,
      },
      [USER_ROLE.superAdmin, USER_ROLE.admin],
      [USER_ROLE.superAdmin, USER_ROLE.admin],
      [USER_ROLE.superAdmin, USER_ROLE.admin],
    );
  }

  protected initializeRoutes(): void {
    // Exclude Method

    setMethodNotAllowed(
      this.router,
      'delete',
      '/:id',
      'Delete action is not allowed for this resource.',
    );
    super.initializeRoutes();
  }
}

export const academicSemesterRoutes = new AcademicSemesterRoute().router;
