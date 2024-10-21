import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', StudentController.getAllStudents);
router.get('/pagination', StudentController.getStudentPaginationQuery);
router.get('/:studentId', StudentController.getSingleStudent);
router.patch(
  '/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent,
);
router.delete(
  '/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentController.deleteStudent,
);

export const StudentRoutes = router;
