import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidations } from './admin.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', AdminController.getAllAdmins);
router.get('/pagination', AdminController.getAdminsByPaginatedQuery);
router.get('/:adminId', AdminController.getSingleAdmin);
router.patch(
  '/:adminId',
  auth(USER_ROLE.superAdmin),
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminController.updateAdmin,
);

router.delete(
  '/:adminId',
  auth(USER_ROLE.superAdmin),
  AdminController.deleteAdmin,
);

export const AdminRoutes = router;
