import { z } from 'zod';
import { DAYS } from './offeredCourse.constant';
// Regular expression for 12-hour time format with AM/PM (e.g., 01:00 PM)
const time12HourFormat = /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;
const createOfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    academicSemester: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number(),
    section: z.number(),
    days: z.array(z.enum([...DAYS] as [string, ...string[]])),
    startTime: z
      .string()
      .regex(time12HourFormat, 'Invalid time format (hh:mm AM/PM)'),
    endTime: z
      .string()
      .regex(time12HourFormat, 'Invalid time format (hh:mm AM/PM)'),
  }),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    days: z.enum([...DAYS] as [string, ...string[]]).optional(),
    startTime: z
      .string()
      .regex(time12HourFormat, 'Invalid time format (hh:mm AM/PM)')
      .optional(),
    endTime: z
      .string()
      .regex(time12HourFormat, 'Invalid time format (hh:mm AM/PM)')
      .optional(),
  }),
});
export const OfferedCourseValidation = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
