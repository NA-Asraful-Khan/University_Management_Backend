import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import { CourseValidations } from './course.validation';
import {
  CourseController,
  FacultiesWithCouresController,
} from './course.controller';

const courseController = new CourseController();
const facultyWithCourse = new FacultiesWithCouresController();

const router = express.Router();

router.post(
  '/create-course',
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
  validateRequest(CourseValidations.updateCourseValidationSchema),
  courseController.update.bind(courseController),
);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.assaignFacultiesWithCourseValidationSchema),
  facultyWithCourse.assignFacultiesWithCourse.bind(facultyWithCourse),
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.assaignFacultiesWithCourseValidationSchema),
  facultyWithCourse.removeFacultiesWithCourse.bind(facultyWithCourse),
);

router.delete('/:id', courseController.softDelete.bind(courseController));

export const CourseRoutes = router;
