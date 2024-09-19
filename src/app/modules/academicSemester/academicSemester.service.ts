import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  academicSemesterNameCodeMapper,
  checkIfSemesterExists,
  validateSemesterCode,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';

const createAcademicSemester = async (payload: TAcademicSemester) => {
  const academicSemesterData: Partial<TAcademicSemester> = { ...payload };
  if (academicSemesterData.name === 'Autumn') {
    academicSemesterData.startMonth = 'January';
    academicSemesterData.endMonth = 'April';
    academicSemesterData.code = '01';
  } else if (academicSemesterData.name === 'Summer') {
    academicSemesterData.startMonth = 'May';
    academicSemesterData.endMonth = 'August';
    academicSemesterData.code = '02';
  } else if (academicSemesterData.name === 'Fall') {
    academicSemesterData.startMonth = 'September';
    academicSemesterData.endMonth = 'December';
    academicSemesterData.code = '03';
  }

  if (
    academicSemesterNameCodeMapper[payload.name] !==
    (academicSemesterData.code || payload.code)
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }
  const result = await AcademicSemesterModel.create(academicSemesterData);

  return result;
};

const getAcademicSemester = async () => {
  const result = await AcademicSemesterModel.find();

  return result;
};

const getSingleAcademicSemester = async (_id: string) => {
  const result = await AcademicSemesterModel.findOne({ _id: _id });

  return result;
};

const updateAcademicSemester = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  const academicSemesterData = await AcademicSemesterModel.findOne({ _id: id });

  // Main logic
  if (payload.name || payload.code || payload.year) {
    // Check for semester existence by year and name
    if (payload.year) {
      await checkIfSemesterExists(
        payload.year,
        payload.name ?? academicSemesterData?.name,
      );
    }

    // Validate code and name if both are present
    if (payload.name && payload.code) {
      validateSemesterCode(payload.name, payload.code);
    } else if (payload.name) {
      if (
        academicSemesterNameCodeMapper[payload.name] !==
        academicSemesterData?.code
      ) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Semester Name');
      }
    } else if (payload.code) {
      if (academicSemesterData?.name) {
        validateSemesterCode(academicSemesterData.name, payload.code);
      }
    }
  }

  const result = await AcademicSemesterModel.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemester,
  getAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
