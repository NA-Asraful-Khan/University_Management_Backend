import { BaseRoute } from '../base/base.route';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterController } from './academicSemester.controller';
import { setMethodNotAllowed } from '../../routes/excludeRoute/excludeRoute';

class AcademicSemesterRoute extends BaseRoute<TAcademicSemester> {
  constructor() {
    super(new AcademicSemesterController());
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
