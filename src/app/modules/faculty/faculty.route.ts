import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidations } from './faculty.validation';

const route = express.Router();

route.get('/', FacultyControllers.getAllFaculty);
route.get('/pagination', FacultyControllers.getFacultyByPaginationQuery);
route.get('/:facultyId', FacultyControllers.getSingleFaculty);
route.patch(
  '/:facultyId',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

route.delete('/:facultyId', FacultyControllers.deleteFaculty);

export const FacultyRoutes = route;
