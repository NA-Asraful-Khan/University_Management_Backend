import express from 'express';
import { DashboardControllers } from './dashboard.controller';

import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const route = express.Router();

route.get('/admin',auth(USER_ROLE.admin, USER_ROLE.superAdmin),DashboardControllers.getAdminDashboard);
route.get('/faculty',auth(USER_ROLE.faculty),DashboardControllers.getFacultyDashboard);
route.get('/student',auth(USER_ROLE.student),DashboardControllers.getStudentDashboard);


export const DashboardRoutes = route;
