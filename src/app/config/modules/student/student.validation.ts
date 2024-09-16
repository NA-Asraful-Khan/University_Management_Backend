import { z } from 'zod';

// 1. UserName Zod Schema
const userNameValidationSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().nonempty('Last name is required'),
});

// 2. LocalGuardian Zod Schema
const localGuardianValidationSchema = z.object({
  name: z.string().nonempty('Local guardian name is required'),
  contactNo: z.string().nonempty('Contact number is required'),
  occupation: z.string().nonempty('Occupation is required'),
  address: z.string().nonempty('Address is required'),
});

// 3. Guardian Zod Schema
const guardianValidationSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required"),
  fatherOccupation: z.string().nonempty("Father's occupation is required"),
  fatherContactNo: z.string().nonempty("Father's contact number is required"),
  motherName: z.string().nonempty("Mother's name is required"),
  motherOccupation: z.string().nonempty("Mother's occupation is required"),
  motherContactNo: z.string().nonempty("Mother's contact number is required"),
});

// 4. Student Zod Schema
const studentValidationSchema = z.object({
  id: z.string(),
  name: userNameValidationSchema,
  gender: z.enum(['female', 'male']),
  dateOfBirth: z.string().optional(),
  email: z.string().email('Invalid email format'),
  contactNo: z.string().nonempty('Contact number is required'),
  emergencyContactNo: z
    .string()
    .nonempty('Emergency contact number is required'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  presentAddress: z.string().nonempty('Present address is required'),
  permanentAddress: z.string().nonempty('Permanent address is required'),
  gurdian: guardianValidationSchema,
  localGuardians: localGuardianValidationSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'blocked']),
});

export default studentValidationSchema;
