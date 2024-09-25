import { BaseRoute } from '../base/base.route';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterController } from './academicSemester.controller';

class AcademicSemesterRoute extends BaseRoute<TAcademicSemester> {
  constructor() {
    super(new AcademicSemesterController());
  }

  protected initializeRoutes(): void {
    // Exclude Method
    this.router.delete('/:id', (req, res) => {
      return res.status(403).json({
        success: false,
        message: 'Delete action is not allowed for Academic Semester.',
      });
    });
    super.initializeRoutes();
  }
}

export const academicSemesterRoutes = new AcademicSemesterRoute().router;
