import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  // auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserController.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  UserController.getMe,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.admin),
  UserController.changeStatus,
);

export const UserRoutes = router;
