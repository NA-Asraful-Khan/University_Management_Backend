import express, { NextFunction, Request, Response } from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidations } from './faculty.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';

const route = express.Router();

route.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
    USER_ROLE.superAdmin,
  ),
  FacultyControllers.getAllFaculty,
);
route.get('/pagination', FacultyControllers.getFacultyByPaginationQuery);
route.get('/:facultyId', FacultyControllers.getSingleFaculty);
route.patch(
  '/:facultyId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

route.delete(
  '/:facultyId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  FacultyControllers.deleteFaculty,
);

export const FacultyRoutes = route;
