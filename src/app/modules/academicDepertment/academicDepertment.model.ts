import { model, Schema } from 'mongoose';
import { TAcademicDepertment } from './academicDepertment.interface';
import AppError from '../../errors/AppError';

const academicDepertmentSchema = new Schema<TAcademicDepertment>(
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

academicDepertmentSchema.pre('save', async function (next) {
  const isDepertmentExist = await AcademicDepertmentModel.findOne({
    name: this.name,
  });

  if (isDepertmentExist) {
    throw new AppError(404, 'Depertment already exists.');
  }
  next();
});

academicDepertmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  const isDepertmentExist = await AcademicDepertmentModel.findOne(query);

  if (!isDepertmentExist) {
    throw new AppError(404, 'Depertment Does not exists.');
  }
  next();
});

export const AcademicDepertmentModel = model<TAcademicDepertment>(
  'AcademicDepertment',
  academicDepertmentSchema,
);
