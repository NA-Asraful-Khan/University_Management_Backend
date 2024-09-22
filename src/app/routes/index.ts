import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepertmentRoutes } from '../modules/academicDepertment/academicDepertment.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { CourseRoutes } from '../modules/course/course.route';

const router = Router();

const moduleRoutes = [
  { path: '/users', component: UserRoutes },
  { path: '/students', component: StudentRoutes },
  { path: '/faculty', component: FacultyRoutes },
  { path: '/admin', component: AdminRoutes },
  { path: '/academic-semesters', component: AcademicSemesterRoutes },
  { path: '/academic-faculty', component: AcademicFacultyRoutes },
  { path: '/academic-depertment', component: AcademicDepertmentRoutes },
  { path: '/course', component: CourseRoutes },
];

moduleRoutes.forEach(({ path, component }) => {
  router.use(path, component);
});

export default router;
