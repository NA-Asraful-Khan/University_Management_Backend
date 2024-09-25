// academicFaculty.model.ts
import { model, Schema } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';

// Remove the explicit reference to `Document` in the model typing
const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt are automatically managed
  },
);

export const AcademicFacultyModel = model<TAcademicFaculty>(
  'AcademicFaculty',
  academicFacultySchema,
);
