import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TAcademicSemesterNameCodeMapper,
  TMonths,
} from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AcademicSemesterName: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
];
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03'];

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

// Helper function to check if the semester exists
export const checkIfSemesterExists = async (year: string, name?: string) => {
  const semester = await AcademicSemesterModel.findOne({ year, name });
  if (semester) {
    throw new Error('Semester already exists for this Year.');
  }
};

// Helper function to validate semester code
export const validateSemesterCode = (name: string, code: string) => {
  if (academicSemesterNameCodeMapper[name] !== code) {
    throw new Error('Invalid Semester Code');
  }
};
