import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicDepertmentValidation } from './academicDepertment.validation';
import { AcademicDepertmentController } from './academicDepertment.controller';

const router = express.Router();

router.post(
  '/create-academic-depertment',
  validateRequest(
    AcademicDepertmentValidation.academicDepertmentValidationSchema,
  ),
  AcademicDepertmentController.createAcademicDepertment,
);

router.get('/', AcademicDepertmentController.getAllAcademicDepertment);
router.get(
  '/:depertmentId',
  AcademicDepertmentController.getSingleAcademicDepertment,
);
router.put(
  '/:depertmentId',
  validateRequest(
    AcademicDepertmentValidation.UpdateAcademicDepertmentValidationSchema,
  ),
  AcademicDepertmentController.updateAcademicDepertment,
);

export const AcademicDepertmentRoutes = router;
