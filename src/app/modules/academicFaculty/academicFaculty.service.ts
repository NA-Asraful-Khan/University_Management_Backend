import { BaseService } from '../base/base.service';
import { AcademicFacultyRepository } from './academicFaculty.repository';
import { TAcademicFaculty } from './academicFaculty.interface';

export class AcademicFacultyService extends BaseService<TAcademicFaculty> {
  constructor() {
    super(new AcademicFacultyRepository());
  }

  async findByFacultyId(facultyId: string): Promise<TAcademicFaculty | null> {
    return (this.repository as AcademicFacultyRepository).findByFacultyId(
      facultyId,
    );
  }
}
