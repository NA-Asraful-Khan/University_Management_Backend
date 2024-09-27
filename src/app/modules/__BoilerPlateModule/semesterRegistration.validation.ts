import { z } from 'zod';

const createSemesterRagistrationValidationSchema = z.object({
  body: z.object({}),
});

export const SemesterRegistrationValidation = {
  createSemesterRagistrationValidationSchema,
};
