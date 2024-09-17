import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.createAcademicSemester,
);

// router.get('/', StudentController.getAllStudents);
// router.get('/:studentId', StudentController.getSingleStudent);
// router.delete('/:studentId', StudentController.deleteStudent);

export const AcademicSemesterRoutes = router;
