import { BaseService } from '../base/base.service';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationRepository } from './semesterRegistration.repository';
export class SemesterRegistrationService extends BaseService<TSemesterRegistration> {
  constructor() {
    super(new SemesterRegistrationRepository());
  }
}
