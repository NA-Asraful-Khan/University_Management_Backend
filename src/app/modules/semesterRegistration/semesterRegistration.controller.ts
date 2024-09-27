import { BaseController } from '../base/base.controller';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationService } from './semesterRegistration.service';

export class SemesterRegistrationController extends BaseController<TSemesterRegistration> {
  constructor() {
    super(new SemesterRegistrationService());
  }
}
