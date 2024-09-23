import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseController } from './course.controller';

const courseController = new CourseController();

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

router.delete('/:id', courseController.softDelete.bind(courseController));

export const CourseRoutes = router;
