import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';

const router = Router();

const moduleRoutes = [
  { path: '/users', component: UserRoutes },
  { path: '/students', component: StudentRoutes },
  { path: '/academic-semesters', component: AcademicSemesterRoutes },
];

moduleRoutes.forEach(({ path, component }) => {
  router.use(path, component);
});

export default router;
