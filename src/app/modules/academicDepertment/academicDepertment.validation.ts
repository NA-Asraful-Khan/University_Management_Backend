import { z } from 'zod';

const academicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Namr Must Be String',
      required_error: 'Name is Required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Faculty Must Be String',
      required_error: 'Faculty is Required',
    }),
  }),
});

const UpdateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Namr Must Be String',
        required_error: 'Name is Required',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic Faculty Must Be String',
        required_error: 'Faculty is Required',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidation = {
  academicDepartmentValidationSchema,
  UpdateAcademicDepartmentValidationSchema,
};
