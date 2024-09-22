import { z } from 'zod';
import { Gender } from '../../constant/gender';
import { BloodGroup } from '../../constant/bloodgroup';

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
      gender: z.enum([...Gender] as [string, ...string[]]),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      gurdian: guardianValidationSchema,
      localGuardians: localGuardianValidationSchema,
      admissionSemester: z.string(),
      academicDepertment: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

// 1. UpdateUserName Zod Schema
const updateUserNameValidationSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

// 2. UpdateLocalGuardian Zod Schema
const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  contactNo: z.string().optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
});

// 3. UpdateGuardian Zod Schema
const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

// 4. UpdateStudent Zod Schema
const updateStudentValidationSchema = z.object({
  body: z
    .object({
      student: z
        .object({
          name: updateUserNameValidationSchema.optional(),
          gender: z.enum([...Gender] as [string, ...string[]]).optional(),
          dateOfBirth: z.string().optional(),
          email: z.string().email().optional(),
          contactNo: z.string().optional(),
          emergencyContactNo: z.string().optional(),
          bloodGroup: z
            .enum([...BloodGroup] as [string, ...string[]])
            .optional(),
          presentAddress: z.string().optional(),
          permanentAddress: z.string().optional(),
          gurdian: updateGuardianValidationSchema.optional(),
          localGuardians: updateLocalGuardianValidationSchema.optional(),
          admissionSemester: z.string().optional(),
          academicDepertment: z.string().optional(),
          profileImg: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
