import { z } from 'zod';

const userValidationSchema = z.object({
  id: z.string(),
  password: z
    .string()
    .max(20, { message: 'Cannot be more than 20 characters' }),
  needsPasswordChange: z.boolean().optional().default(true),
  role: z.enum(['student', 'admin', 'faculty']),
  status: z.enum(['in-progress', 'blocked']).default('in-progress'),
  isDelete: z.boolean().optional().default(false),
});

export const UserValidation = {
  userValidationSchema,
};
