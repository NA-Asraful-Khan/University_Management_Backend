import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidations } from './admin.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.get('/', AdminController.getAllAdmins);
router.get('/pagination', AdminController.getAdminsByPaginatedQuery);
router.get('/:adminId', AdminController.getSingleAdmin);
router.patch(
  '/:adminId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminController.updateAdmin,
);

router.delete(
  '/:adminId',
  auth(USER_ROLE.superAdmin),
  AdminController.deleteAdmin,
);

export const AdminRoutes = router;
