import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidations } from './faculty.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const route = express.Router();

route.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  FacultyControllers.getAllFaculty,
);
route.get('/pagination', FacultyControllers.getFacultyByPaginationQuery);
route.get('/:facultyId', FacultyControllers.getSingleFaculty);
route.patch(
  '/:facultyId',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

route.delete('/:facultyId', FacultyControllers.deleteFaculty);

export const FacultyRoutes = route;
