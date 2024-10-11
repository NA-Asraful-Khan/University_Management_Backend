import { z } from 'zod';

const createSemesterRagistrationValidationSchema = z.object({
  body: z.object({}),
});
const updateSemesterRagistrationValidationSchema = z.object({
  body: z.object({}),
});

export const SemesterRegistrationValidation = {
  createSemesterRagistrationValidationSchema,
  updateSemesterRagistrationValidationSchema,
};
