import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseController } from './course.controller';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse,
);

router.get('/', CourseController.getAllCourses);
router.get('/pagination', CourseController.getCoursesbyPaginationQuery);

router.get('/:courseId', CourseController.getSingleCourse);

router.delete('/:courseId', CourseController.deleteCourse);

export const CourseRoutes = router;
