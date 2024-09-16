import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string()
    .max(20, { message: 'Cannot be more than 20 characters' })
    .optional(),
});

export const UserValidation = {
  userValidationSchema,
};
