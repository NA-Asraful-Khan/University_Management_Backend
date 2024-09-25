// academicFaculty.route.ts

import { TAcademicFaculty } from './academicFaculty.interface';
import { BaseRoute } from '../base/base.route';
import { AcademicFacultyController } from './academicFaculty.controller';

class AcademicFacultyRoute extends BaseRoute<TAcademicFaculty> {
  constructor() {
    super(new AcademicFacultyController());
  }

  protected initializeRoutes(): void {
    const Controller = this.controller as AcademicFacultyController;

    this.router.get('/:facultyId', Controller.findByFacultyId);

    // Exclude Method
    this.router.delete('/:id', (req, res) => {
      return res.status(403).json({
        success: false,
        message: 'Delete action is not allowed for Academic Faculty.',
      });
    });

    super.initializeRoutes();
  }
}

export const academicFacultyRoutes = new AcademicFacultyRoute().router;
