import { BaseRoute } from '../base/base.route';

import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';

class SemesterRegistrationRoute extends BaseRoute<TSemesterRegistration> {
  constructor() {
    super(new SemesterRegistrationController(), {
      create:
        SemesterRegistrationValidation.createSemesterRagistrationValidationSchema,
      update:
        SemesterRegistrationValidation.updateSemesterRagistrationValidationSchema,
    });
  }

  protected initializeRoutes(): void {
    // Exclude Route

    super.initializeRoutes();
  }
}

export const semesterRegistrationRoutes = new SemesterRegistrationRoute()
  .router;
