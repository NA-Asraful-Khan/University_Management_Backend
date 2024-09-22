import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepertmentRoutes } from '../modules/academicDepertment/academicDepertment.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';

const router = Router();

const moduleRoutes = [
  { path: '/users', component: UserRoutes },
  { path: '/students', component: StudentRoutes },
  { path: '/faculty', component: FacultyRoutes },
  { path: '/academic-semesters', component: AcademicSemesterRoutes },
  { path: '/academic-faculty', component: AcademicFacultyRoutes },
  { path: '/academic-depertment', component: AcademicDepertmentRoutes },
];

moduleRoutes.forEach(({ path, component }) => {
  router.use(path, component);
});

export default router;
