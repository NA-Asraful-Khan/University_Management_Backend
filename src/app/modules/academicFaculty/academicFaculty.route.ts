import express from 'express';
import { AcademicFacultyController } from './academicFaculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
const academicFacultyController = new AcademicFacultyController();
const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(AcademicFacultyValidation.academicFacultyValidationSchema),
  academicFacultyController.create.bind(academicFacultyController),
);

router.get(
  '/',
  academicFacultyController.findAll.bind(academicFacultyController),
);
router.get(
  '/:facultyId',
  academicFacultyController.findByFacultyId.bind(academicFacultyController),
);

router.put(
  '/:id',
  academicFacultyController.update.bind(academicFacultyController),
);
router.patch(
  '/:id',
  academicFacultyController.softDelete.bind(academicFacultyController),
);

router.delete(
  '/:id',
  academicFacultyController.delete.bind(academicFacultyController),
);

// router.post('/', userController.create.bind(userController));
// router.get('/', userController.findAll.bind(userController));
// router.get('/:id', userController.findById.bind(userController));
// router.put('/:id', userController.update.bind(userController));
// router.delete('/:id', userController.delete.bind(userController));

export const AcademicFacultyRoutes = router;
