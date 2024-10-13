import { BaseRoute } from '../base/base.route';
import { USER_ROLE } from '../user/user.constant';
import { OfferedCourseController } from './offeredCourse.controller';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourseValidation } from './offeredCourse.validation';

class OfferedCourse extends BaseRoute<TOfferedCourse> {
  constructor() {
    super(
      new OfferedCourseController(),
      {
        create: OfferedCourseValidation.createOfferedCourseValidationSchema,
        update: OfferedCourseValidation.updateOfferedCourseValidationSchema,
      },
      [USER_ROLE.admin],
      [USER_ROLE.admin],
    );
  }

  protected initializeRoutes(): void {
    // Exclude Route

    super.initializeRoutes();
  }
}

export const offeredCourseRoutes = new OfferedCourse().router;
