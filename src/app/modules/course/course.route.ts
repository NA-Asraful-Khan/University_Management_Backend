import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import { CourseValidations } from './course.validation';
import {
  CourseController,
  FacultiesWithCouresController,
} from './course.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const courseController = new CourseController();
const facultyWithCourse = new FacultiesWithCouresController();

const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  courseController.create.bind(courseController),
);

router.get('/', courseController.findAll.bind(courseController));
router.get(
  '/pagination',
  courseController.findPaginationQuery.bind(courseController),
);

router.get('/:id', courseController.findById.bind(courseController));

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  courseController.update.bind(courseController),
);

router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.assaignFacultiesWithCourseValidationSchema),
  facultyWithCourse.assignFacultiesWithCourse.bind(facultyWithCourse),
);
router.get(
  '/:courseId/get-faculties',
  facultyWithCourse.getFacultiesWithCourse.bind(facultyWithCourse),
);

router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.assaignFacultiesWithCourseValidationSchema),
  facultyWithCourse.removeFacultiesWithCourse.bind(facultyWithCourse),
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  courseController.softDelete.bind(courseController),
);

export const CourseRoutes = router;
