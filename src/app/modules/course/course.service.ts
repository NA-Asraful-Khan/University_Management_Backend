/* eslint-disable no-unused-vars */
import { BaseService } from '../base/base.service';
import { TCourse, TCourseFaculty } from './course.interface';
import {
  CourseRepository,
  FacultiesWithCourseRepository,
} from './course.repository';

export class CourseService extends BaseService<TCourse> {
  constructor() {
    super(new CourseRepository());
  }
}

// Implement the extended service
export class FacultiesWithCouresService extends BaseService<TCourseFaculty> {
  constructor() {
    super(new FacultiesWithCourseRepository());
  }

  async getFacultiesWithCourse(
    courseId: string,
  ): Promise<TCourseFaculty | null> {
    return this.repository.findById(courseId);
  }
  async assignFacultiesWithCourse(
    courseId: string,
    data: { faculties: string[] },
  ): Promise<TCourseFaculty | null> {
    return (
      this.repository as FacultiesWithCourseRepository
    ).assignFacultiesWithCourse(courseId, data);
  }

  async removeFacultiesWithCourse(
    courseId: string,
    data: { faculties: string[] },
  ): Promise<TCourseFaculty | null> {
    return (
      this.repository as FacultiesWithCourseRepository
    ).removeFacultiesWithCourse(courseId, data);
  }
}
