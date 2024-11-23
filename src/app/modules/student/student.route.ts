import express, { NextFunction, Request, Response } from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.get('/', StudentController.getAllStudents);
router.get('/pagination', StudentController.getStudentPaginationQuery);
router.get('/:studentId', StudentController.getSingleStudent);
router.patch(
  '/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent,
);

router.delete(
  '/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentController.deleteStudent,
);

export const StudentRoutes = router;
