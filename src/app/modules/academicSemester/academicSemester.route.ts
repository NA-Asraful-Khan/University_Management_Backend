import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicSemesterValidation } from './academicSemester.validation';
import { AcademicSemesterController } from './academicSemester.controller';

const router = express.Router();
const Controller = new AcademicSemesterController();
router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  Controller.create.bind(Controller),
);

router.get('/', Controller.findAll.bind(Controller));
router.get('/:id', Controller.findById.bind(Controller));
router.put('/:id', Controller.update.bind(Controller));

export const AcademicSemesterRoutes = router;
