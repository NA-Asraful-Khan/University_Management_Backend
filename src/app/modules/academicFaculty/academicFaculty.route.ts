// academicFaculty.route.ts

import { TAcademicFaculty } from './academicFaculty.interface';
import { BaseRoute } from '../base/base.route';
import { AcademicFacultyController } from './academicFaculty.controller';
import {
  setDeleteNotAllowed,
  setPatchNotAllowed,
} from '../../routes/excludeRoute/excludeRoute';

class AcademicFacultyRoute extends BaseRoute<TAcademicFaculty> {
  constructor() {
    super(new AcademicFacultyController());
  }

  protected initializeRoutes(): void {
    const Controller = this.controller as AcademicFacultyController;
    // overwrite Route || Create New Route
    this.router.get('/:facultyId', Controller.findByFacultyId);

    // Exclude Route
    setPatchNotAllowed(this.router);
    setDeleteNotAllowed(this.router);

    super.initializeRoutes();
  }
}

export const academicFacultyRoutes = new AcademicFacultyRoute().router;
