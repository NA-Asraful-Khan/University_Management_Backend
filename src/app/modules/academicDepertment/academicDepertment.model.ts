import { model, Schema } from 'mongoose';
import AppError from '../../errors/AppError';
import { TAcademicDepartment } from './academicDepertment.interface';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isDepertmentExist = await AcademicDepartmentModel.findOne({
    name: this.name,
  });

  if (isDepertmentExist) {
    throw new AppError(404, 'Depertment already exists.');
  }

  const isFacultyExist = await AcademicFacultyModel.findById({
    _id: this.academicFaculty,
  });
  if (!isFacultyExist) {
    throw new AppError(404, 'Academic Faculty Not Found');
  }
  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  const isDepertmentExist = await AcademicDepartmentModel.findOne(query);

  if (!isDepertmentExist) {
    throw new AppError(404, 'Depertment Does not exists.');
  }
  next();
});

export const AcademicDepartmentModel = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
