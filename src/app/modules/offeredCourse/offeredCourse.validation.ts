import { z } from 'zod';
import { DAYS } from './offeredCourse.constant';
// Regular expression for 12-hour time format with AM/PM (e.g., 01:00 PM)
// const time12HourFormat = /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;
const time24HourFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...DAYS] as [string, ...string[]])),
      startTime: z
        .string()
        .regex(time24HourFormat, 'Invalid time format (hh:mm)'),
      endTime: z
        .string()
        .regex(time24HourFormat, 'Invalid time format (hh:mm)'),
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);

        return end > start;
      },
      {
        message: 'Start time must be before end time',
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string(),
    maxCapacity: z.number(),
    days: z.array(z.enum([...DAYS] as [string, ...string[]])),
    startTime: z
      .string()
      .regex(time24HourFormat, 'Invalid time format (hh:mm)'),
    endTime: z.string().regex(time24HourFormat, 'Invalid time format (hh:mm)'),
  }),
});
export const OfferedCourseValidation = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
