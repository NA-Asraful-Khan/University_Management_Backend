import { z } from 'zod';

// 1. UserName Zod Schema
const userNameValidationSchema = z.object({
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
});

// 2. LocalGuardian Zod Schema
const localGuardianValidationSchema = z.object({
  name: z.string(),
  contactNo: z.string(),
  occupation: z.string(),
  address: z.string(),
});

// 3. Guardian Zod Schema
const guardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

// 4. Student Zod Schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(16).optional(),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['female', 'male']),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      gurdian: guardianValidationSchema,
      localGuardians: localGuardianValidationSchema,
      profileImg: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
};
