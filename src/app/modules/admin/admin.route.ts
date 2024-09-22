import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidations } from './admin.validation';

const router = express.Router();

router.get('/', AdminController.getAllAdmins);
router.get('/pagination', AdminController.getAdminsByPaginatedQuery);
router.get('/:adminId', AdminController.getSingleAdmin);
router.patch(
  '/:adminId',
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminController.updateAdmin,
);

router.delete('/:adminId', AdminController.deleteAdmin);

export const AdminRoutes = router;
