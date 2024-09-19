import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyController } from './academicFaculty.controller';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(AcademicFacultyValidation.academicFacultyValidationSchema),
  AcademicFacultyController.createAcademicFaculty,
);

router.get('/', AcademicFacultyController.getAllAcademicFaculties);
router.get('/:facultyId', AcademicFacultyController.getSingleAcademicFaculty);
router.put('/:facultyId', AcademicFacultyController.updateAcademicFaculty);

export const AcademicFacultyRoutes = router;
