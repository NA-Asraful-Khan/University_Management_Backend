import { Schema, model } from 'mongoose';

import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';

// 2. Create a Schema corresponding to the document interface.
const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: AcademicSemesterName,
    },
    year: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      enum: AcademicSemesterCode,
    },
    startMonth: {
      type: String,
      enum: Months,
    },
    endMonth: {
      type: String,
      enum: Months,
    },
  },
  {
    timestamps: true,
  },
);

// // Middleware configuration
// Document Middlware configuration
academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExist = await AcademicSemesterModel.findOne({
    year: this.year,
    name: this.name,
  });

  if (isSemesterExist) {
    throw new Error('Semester already exists for this Year.');
  }
  next();
});
academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
  // Explicitly type the update as `Partial<AcademicSemester>` or a suitable type
  const update = this.getUpdate() as Partial<{
    name: string;
    code: string;
    year: string;
  }>;

  // Ensure the update contains year, as both name and code should only conflict if in the same year
  if (update && typeof update === 'object' && update.year) {
    const query: { year: string; $or?: { name?: string; code?: string }[] } = {
      year: update.year,
    };

    // Add name and code to the query only if they're part of the update
    const orConditions: { name?: string; code?: string }[] = [];
    if (update.name) {
      orConditions.push({ name: update.name });
    }
    if (update.code) {
      orConditions.push({ code: update.code });
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;

      // Check if any semester with the same year and either the name or code exists
      const isSemesterExist = await AcademicSemesterModel.findOne(query);

      if (isSemesterExist) {
        // If found, throw an error
        throw new Error(
          'Semester with this name or code already exists in the same year',
        );
      }
    }
  }

  next();
});

// 3. Create a model using the schema.
export const AcademicSemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
