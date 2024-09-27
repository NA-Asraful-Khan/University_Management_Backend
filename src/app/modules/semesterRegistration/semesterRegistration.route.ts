import { BaseRoute } from '../base/base.route';

import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationController } from './semesterRegistration.controller';

class SemesterRegistrationRoute extends BaseRoute<TSemesterRegistration> {
  constructor() {
    super(new SemesterRegistrationController());
  }

  protected initializeRoutes(): void {
    // Exclude Route

    super.initializeRoutes();
  }
}

export const semesterRegistrationRoutes = new SemesterRegistrationRoute()
  .router;
