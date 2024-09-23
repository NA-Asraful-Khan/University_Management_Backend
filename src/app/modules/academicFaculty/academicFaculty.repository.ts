import { BaseRepository } from '../base/base.repository';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';

export class AcademicFacultyRepository extends BaseRepository<TAcademicFaculty> {
  constructor() {
    super(AcademicFacultyModel);
  }

  async findByFacultyId(facultyId: string): Promise<TAcademicFaculty | null> {
    return this.model.findOne({ _id: facultyId });
  }
}
