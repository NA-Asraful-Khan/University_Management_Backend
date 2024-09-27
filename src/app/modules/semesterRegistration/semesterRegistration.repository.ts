import { BaseRepository } from '../base/base.repository';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';

export class SemesterRegistrationRepository extends BaseRepository<TSemesterRegistration> {
  constructor() {
    super(SemesterRegistrationModel);
  }
}
