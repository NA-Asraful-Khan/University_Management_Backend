import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicDepertmentValidation } from './academicDepertment.validation';
import { AcademicDepertmentController } from './academicDepertment.controller';

const router = express.Router();
const Controller = new AcademicDepertmentController();
router.post(
  '/create-academic-depertment',
  validateRequest(
    AcademicDepertmentValidation.academicDepertmentValidationSchema,
  ),
  Controller.create.bind(Controller),
);

router.get('/', Controller.findAll.bind(Controller));
router.get('/:depertmentId', Controller.findById.bind(Controller));
router.put(
  '/:depertmentId',
  validateRequest(
    AcademicDepertmentValidation.UpdateAcademicDepertmentValidationSchema,
  ),
  Controller.update.bind(Controller),
);

export const AcademicDepertmentRoutes = router;
